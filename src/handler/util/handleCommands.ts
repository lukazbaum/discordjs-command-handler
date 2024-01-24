import { glob } from "glob";
import Logger from "./Logger";
import { client } from "../../index";
import { DiscordClient } from "./DiscordClient";
import { commandsFolderName, ownerId } from "../../config";
import { CommandTypes, RegisterCommandOptions, RegisterTypes } from "../types/Command";
import {
    APIInteractionGuildMember, ApplicationCommandType,
    Channel,
    Collection,
    Guild,
    GuildMember,
    REST,
    Routes,
    TextChannel,
    User
} from "discord.js";

export async function registerCommands(client: DiscordClient, options: RegisterCommandOptions): Promise<void> {
    await getCommandModules(client);
    if (options.deploy) await deploySlashCommands(client);
}

async function getCommandModules(client: DiscordClient): Promise<void> {
    let commandPaths: string[] = await glob(`**/${commandsFolderName}/**/**/*.js`);
    for (const command of commandPaths) {
        let importPath: string = `../..${command.replace(/^dist[\\\/]|\\/g, "/")}`;
        try {
            let module = (await import(importPath)).default;
            if (module.type === CommandTypes.SlashCommand && (!module.data.name || !module.data.description)) {
                Logger.error(`No name or description for command at ${importPath} set`);
                return;
            }
            if (module.type === CommandTypes.SlashCommand) {
                if (module.disabled) continue;
                client.commands.slash.set(module.data.name, module);
            } else if (module.type === CommandTypes.PrefixCommand) {
                if (module.disabled) continue;
                client.commands.prefix.set(module.name, module);
                if (module.aliases) {
                    for (const alias of module.aliases) {
                        client.commands.aliases.prefix.set(alias, module.name);
                    }
                }
            } else if (module.type === CommandTypes.MessageCommand) {
                if (module.disabled) continue;
                client.commands.message.set(module.name, module);
                if (module.aliases) {
                    for (const alias of module.aliases) {
                        client.commands.aliases.message.set(alias, module.name);
                    }
                }
            } else if (module.type === CommandTypes.PingCommand) {
                if (module.disabled) continue;
                client.commands.ping.set(module.name, module);
                if (module.aliases) {
                    for (const alias of module.aliases) {
                        client.commands.aliases.ping.set(alias, module.name);
                    }
                }
            } else if (module.type === CommandTypes.ContextMenu) {
                if (module.disabled) continue;
                client.commands.context.set(module.data.name, module);
            }
        } catch (err) {
            Logger.error(`Failed to load command at ${importPath}`);
        }
    }
    if (client.commands.slash.size > 100) {
        Logger.error("You can only register 100 Slash Commands.");
        process.exit();
    }
    if ((client.commands.context.filter(
        command => command.data.type === ApplicationCommandType.Message)).size > 5
    ) {
        Logger.error("You can only register 5 Message Context Menus.");
        process.exit();
    }
    if ((client.commands.context.filter(
        command => command.data.type === ApplicationCommandType.User)).size > 5
    ) {
        Logger.error("You can only register 5 Message User Menus.");
        process.exit();
    }
}

async function deploySlashCommands(client: DiscordClient): Promise<void> {
    let guildCommands: any[] = [];
    let globalCommands: any[] = [];

    for (const module of client.commands.slash) {
        if (module[1].register === RegisterTypes.Guild) guildCommands.push(module[1].data);
        if (module[1].register === RegisterTypes.Global) globalCommands.push(module[1].data);
    }

    for (const module of client.commands.context) {
        if (module[1].register === RegisterTypes.Guild) guildCommands.push(module[1].data);
        if (module[1].register === RegisterTypes.Global) globalCommands.push(module[1].data);
    }

    if (guildCommands.length > 0) await uploadSlashCommands(RegisterTypes.Guild, guildCommands);
    if (globalCommands.length > 0) await uploadSlashCommands(RegisterTypes.Global, globalCommands);
}

async function uploadSlashCommands(type: RegisterTypes, commands: Array<any>): Promise<void> {
    if (!process.env.CLIENT_TOKEN) return Logger.error("No TOKEN set!");
    if (!process.env.CLIENT_ID) return Logger.error("No CLIENT_ID set!");
    if (RegisterTypes.Guild && !process.env.GUILD_ID) return Logger.error("No GUILD_ID set!");

    const rest: REST = new REST({ version: "10" }).setToken(process.env.CLIENT_TOKEN);
    try {
        Logger.log(`Started refreshing ${commands.length} application commands`);
        await rest.put(
            Routes[type](process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands }
        );
        Logger.log(`Successfully reloaded ${commands.length} application commands`);
    } catch (err) {
        Logger.error("Error in uploadCommands", err);
    }
}

export async function deleteCommands(commandIds: string[], type: RegisterTypes): Promise<void> {
    if (!process.env.CLIENT_ID) return Logger.error("No CLIENT_ID set!");
    if (RegisterTypes.Guild && !process.env.GUILD_ID) return Logger.error("No GUILD_ID set!");

    const rest: REST = new REST({ version: "10" }).setToken(process.env.CLIENT_TOKEN);
    if (type === RegisterTypes.Guild) {
        for (const commandId of commandIds) {
            await rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID, process.env.GUILD_ID, commandId))
                .then(() => Logger.log(`Successfully deleted guild command: ${commandId}`))
                .catch(console.error);
        }
    }

    if (type === RegisterTypes.Global) {
        for (const commandId of commandIds) {
            await rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, commandId))
                .then(() => Logger.log(`Successfully deleted global command: ${commandId}`))
                .catch(console.error);
        }
    }
}

export async function deleteAllCommands(type: RegisterTypes): Promise<void> {
    if (!process.env.CLIENT_ID) return Logger.error("No CLIENT_ID set!");
    if (RegisterTypes.Guild && !process.env.GUILD_ID) return Logger.error("No GUILD_ID set!");

    const rest: REST = new REST({ version: "10" }).setToken(process.env.CLIENT_TOKEN);
    if (type === RegisterTypes.Guild) {
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: [] })
            .then(() => Logger.log("Successfully deleted all guild commands"))
            .catch(console.error);
    }

    if (type === RegisterTypes.Global) {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
            .then(() => Logger.log("Successfully deleted all global commands"))
            .catch(console.error);
    }
}

export async function isAllowedCommand(
    command: any,
    user: User | undefined,
    guild: Guild | null,
    channel: Channel | null,
    member: GuildMember | APIInteractionGuildMember | null
): Promise<boolean> {
    if (!user || !member) return false;
    const memberRoles: any = member.roles;

    return ((command.ownerOnly && user.id !== ownerId)
            || (command.userWhitelist && !command.userWhitelist.includes(user.id))
            || (command.userBlacklist && command.userBlacklist.includes(user.id))
            || (command.channelWhitelist && channel && !command.channelWhitelist.includes(channel.id))
            || (command.channelBlacklist && channel && command.channelBlacklist.includes(channel.id))
            || (command.guildWhitelist && guild && !command.guildWhitelist.includes(guild.id))
            || (command.guildBlacklist && guild && command.guildBlacklist.includes(guild.id))
            || (command.roleWhitelist && !command.roleWhitelist.some((roleId: string) => memberRoles.cache.has(roleId)))
            || (command.roleBlacklist && command.roleBlacklist.some((roleId: string) => memberRoles.cache.has(roleId))))
        || (command.nsfw && channel && !(channel as TextChannel).nsfw);
}

export async function hasCooldown(userId: string, commandName: string, cooldown: number | undefined): Promise<boolean | number> {
    if (cooldown) {
        let currentTimestamp: number = Math.floor(Date.now() / 1000);
        let commandCollection: Collection<string, number> | undefined = client.cooldowns.user.get(commandName);

        if (!commandCollection) {
            client.cooldowns.user.set(commandName, new Collection<string, number>());
            commandCollection = client.cooldowns.user.get(commandName);
        }

        let userCooldown: number | undefined = commandCollection?.get(userId);
        if (userCooldown) {
            if (currentTimestamp < userCooldown) {
                return userCooldown - currentTimestamp;
            }
        }

        commandCollection?.set(userId, currentTimestamp + cooldown);
        return true;
    }
    return true;
}