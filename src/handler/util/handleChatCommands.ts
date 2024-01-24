import { client } from "../../index";
import { Message } from "discord.js";
import { getCommandOnCooldownEmbed, prefix } from "../../config";
import { hasCooldown, isAllowedCommand } from "./handleCommands";
import { MessageCommandModule, PingCommandModule, PrefixCommandModule } from "../types/Command";

export async function handleMessageCommands(message: Message): Promise<void> {
    if (!client.user) return;
    if (message.content.startsWith(prefix)) await handlePrefixCommand(message);
    else if (message.content.startsWith(`<@${client.user.id}>`)) await handlePingCommand(message);
    else await handleMessageCommand(message);
}

async function handlePrefixCommand(message: Message): Promise<void> {
    const messageCommand: string = message.content.split(" ")[0].replace(prefix, "");
    let command: PrefixCommandModule | string | undefined =
        client.commands.prefix.get(messageCommand)
        || client.commands.aliases.prefix.get(messageCommand);

    if (typeof command === "string") command = client.commands.prefix.get(command);

    if (command) {
        if (command.permissions && !hasPermissions(message.member, command.permissions)) return;
        const cooldown: boolean | number = await hasCooldown(message.author.id, command.name, command.cooldown);
        if (typeof cooldown === "number") {
            await message.reply({
                embeds: [getCommandOnCooldownEmbed(cooldown, command.name)]
            });
            return;
        }

        message.content.replace(`${prefix}${command.name} `, "");
        if (!await isAllowedCommand(command, message.member?.user, message.guild, message.channel, message.member))
            await command.execute(message);
    }
}

async function handlePingCommand(message: Message): Promise<void> {
    if (!client.user) return;

    const messageCommand: string = message.content.split(" ")[1].replace(/ /g, "");
    let command: PingCommandModule | string | undefined =
        client.commands.ping.get(messageCommand)
        || client.commands.aliases.ping.get(messageCommand);

    if (typeof command === "string") command = client.commands.ping.get(command);

    if (command) {
        if (command.permissions && !hasPermissions(message.member, command.permissions)) return;
        const cooldown: boolean | number = await hasCooldown(message.author.id, command.name, command.cooldown);
        if (typeof cooldown === "number") {
            await message.reply({
                embeds: [getCommandOnCooldownEmbed(cooldown, command.name)]
            });
            return;
        }

        message.content = message.content.replace(`<@${client.user.id}> ${command.name} `, "");
        if (!await isAllowedCommand(command, message.member?.user, message.guild, message.channel, message.member))
            await command.execute(message);
    }
}

async function handleMessageCommand(message: Message): Promise<void> {
    const messageCommand: string = message.content.split(" ")[0];
    let command: MessageCommandModule | string | undefined =
        client.commands.message.get(messageCommand)
        || client.commands.aliases.message.get(messageCommand);

    if (typeof command === "string") command = client.commands.message.get(command);

    if (command) {
        if (command.permissions && !hasPermissions(message.member, command.permissions)) return;
        const cooldown: boolean | number = await hasCooldown(message.author.id, command.name, command.cooldown);
        if (typeof cooldown === "number") {
            await message.reply({
                embeds: [getCommandOnCooldownEmbed(cooldown, command.name)]
            });
            return;
        }

        if (!await isAllowedCommand(command, message.member?.user, message.guild, message.channel, message.member))
            await command.execute(message);
    }
}

function hasPermissions(member: any, permissions: string[]): boolean {
    return permissions.every(permission => member.permissions.has(permission));
}