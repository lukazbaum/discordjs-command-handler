import config from '../../../config';
import { client } from '../../../index';
import { LogManager } from '../../utils/LogManager';
import type { PrefixCommand } from '../prefix/PrefixCommand';
import type { ContextMenu } from '../interactions/ContextMenu';
import type { SlashCommand } from '../interactions/SlashCommand';
import { CommandValidator } from '../validators/CommandValidator';
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Colors,
  ContextMenuCommandInteraction,
  EmbedBuilder,
  Message,
} from 'discord.js';

export class CommandHandler {
  static async handleSlashCommandInteraction(
    interaction: ChatInputCommandInteraction | AutocompleteInteraction,
  ): Promise<void> {
    const command = client.commands.slash.get(interaction.commandName) as SlashCommand | undefined;

    if (!command) {
      return LogManager.logError(`No command matching ${interaction.commandName} was found.`);
    }

    if (interaction.isAutocomplete()) {
      return this.handleAutocomplete(interaction, command);
    }

    if (!(await this.checkCommandPermission(command, interaction))) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      LogManager.logError(`Error executing command ${interaction.commandName}`, err);
    }
  }

  static async handleContextMenuInteraction(interaction: ContextMenuCommandInteraction): Promise<void> {
    const contextMenu = client.commands.context.get(interaction.commandName) as ContextMenu | undefined;

    if (!contextMenu) {
      return LogManager.logError(`No context menu matching ${interaction.commandName} was found.`);
    }

    if (!(await this.checkCommandPermission(contextMenu, interaction))) return;

    try {
      await contextMenu.execute(interaction);
    } catch (err) {
      LogManager.logError(`Error executing context menu ${interaction.commandName}`, err);
    }
  }

  static async handlePrefixCommand(message: Message): Promise<void> {
    const commandName: string = message.content.slice(config.prefix.length).trim().split(/\s+/)[0];
    const resolvedCommandName: string = client.commands.prefixAliases.get(commandName) ?? commandName;

    const command: PrefixCommand | undefined = client.commands.prefix.get(resolvedCommandName);

    if (!command) {
      return;
    }

    if (!(await this.checkCommandPermission(command, message))) return;

    try {
      await command.execute(message);
    } catch (err) {
      LogManager.logError(`Error executing prefix command ${resolvedCommandName}`, err);
    }
  }

  private static async handleAutocomplete(interaction: AutocompleteInteraction, command: SlashCommand): Promise<void> {
    if (!command.autocomplete) {
      return LogManager.logError(`No autocomplete in ${interaction.commandName} was found.`);
    }

    try {
      await command.autocomplete(interaction);
    } catch (err) {
      LogManager.logError(`Error executing autocomplete for command ${interaction.commandName}`, err);
    }
  }

  private static async checkCommandPermission(
    command: SlashCommand | ContextMenu | PrefixCommand,
    context: any,
  ): Promise<boolean> {
    const { allowed, reason, cooldown } = CommandValidator.isAllowedCommand(
      command,
      context.user || context.author,
      context.channel,
      context.guild,
      context.member,
    );

    if (allowed) return true;

    const reply = cooldown?.timeLeft
      ? config.deniedCommandReplies.cooldowns[cooldown.type]?.replace('{time}', cooldown.timeLeft.toString())
      : config.deniedCommandReplies.specific[reason ?? ''] || config.deniedCommandReplies.general;

    const replyEmbed: EmbedBuilder = new EmbedBuilder().setColor(Colors.Red).setTitle(reply);

    await (context.reply?.({
      embeds: [replyEmbed],
      ephemeral: true,
    }) || context.channel.send({ embeds: [replyEmbed] }));
    return false;
  }
}
