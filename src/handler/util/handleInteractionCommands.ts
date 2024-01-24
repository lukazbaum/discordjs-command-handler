import Logger from "./Logger";
import { client } from "../../index";
import { hasCooldown, isAllowedCommand } from "./handleCommands";
import { ContextMenuCommandModule, SlashCommandModule } from "../types/Command";
import { getCommandNotAllowedEmbed, getCommandOnCooldownEmbed } from "../../config";
import {
    AutocompleteInteraction,
    CommandInteraction,
    ContextMenuCommandInteraction,
    Interaction
} from "discord.js";

export async function handleInteractionCommands(interaction: Interaction): Promise<void> {
    if (interaction.isChatInputCommand()) await handleSlashCommands(interaction);
    else if (interaction.isContextMenuCommand()) await handleContextMenu(interaction);
    else if (interaction.isAutocomplete()) await handleAutocomplete(interaction);
}

async function handleSlashCommands(interaction: CommandInteraction): Promise<void> {
    const command: SlashCommandModule | undefined = client.commands.slash.get(interaction.commandName);
    if (!command) return Logger.error(`No command matching ${interaction.commandName} was found.`);

    const cooldown: boolean | number = await hasCooldown(interaction.user.id, command.data.name, command.cooldown);
    if (typeof cooldown === "number") {
        await interaction.reply({
            embeds: [getCommandOnCooldownEmbed(cooldown, command.data.name)],
            ephemeral: true
        });
        return;
    }

    if (
        await isAllowedCommand(command, interaction.user, interaction.guild, interaction.channel, interaction.member)
    ) {
        await interaction.reply({ embeds: [getCommandNotAllowedEmbed(interaction as Interaction)], ephemeral: true });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (err) {
        return Logger.error(`Error executing ${interaction.commandName}`, err);
    }
}

async function handleContextMenu(interaction: ContextMenuCommandInteraction): Promise<void> {
    const command: ContextMenuCommandModule | undefined = client.commands.context.get(interaction.commandName);
    if (!command) return Logger.error(`No command matching ${interaction.commandName} was found.`);

    const cooldown: boolean | number = await hasCooldown(interaction.user.id, command.data.name, command.cooldown);
    if (typeof cooldown === "number") {
        await interaction.reply({
            embeds: [getCommandOnCooldownEmbed(cooldown, command.data.name)],
            ephemeral: true
        });
        return;
    }

    if (
        await isAllowedCommand(command, interaction.user, interaction.guild, interaction.channel, interaction.member)
    ) {
        await interaction.reply({ embeds: [getCommandNotAllowedEmbed(interaction as Interaction)], ephemeral: true });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (err) {
        return Logger.error(`Error executing ${interaction.commandName}`, err);
    }
}

async function handleAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const command: SlashCommandModule | undefined = client.commands.slash.get(interaction.commandName);
    if (!command) return Logger.error(`No command matching ${interaction.commandName} was found.`);
    if (!command.autocomplete) return Logger.error(`No autocomplete in ${interaction.commandName} was found.`)

    try {
        await command.autocomplete(interaction);
    } catch (err) {
        return Logger.error(`Error autocompleting ${interaction.commandName}`, err);
    }
}