import type { Config } from './handler';
import {
  type ContextMenuCommandInteraction,
  EmbedBuilder,
  GatewayIntentBits,
  type Interaction,
  Message,
  type MessageReplyOptions,
} from 'discord.js';

const defaultConfig: Config = {
  prefix: '!',
  ownerId: 'YOUR_USER_ID',
  eventsFolder: 'events',
  commandsFolder: 'commands',
  componentsFolder: 'components',
  defaultIntents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],

  /* More customizability coming soon */
  deniedCommandReplies: {
    general: 'You are not allowed to use this command.',
    specific: {
      allowedUsers: 'This command is restricted to specific users.',
      blockedUsers: 'You have been blocked from using this command.',
      allowedChannels: 'This command can only be used in specific channels.',
      blockedChannels: 'This channel is not allowed to use this command.',
      allowedCategories: 'This command is restricted to specific categories.',
      blockedCategories: 'This category is blocked from using this command.',
      allowedGuilds: 'This command is only available in specific servers.',
      blockedGuilds: 'This server is not allowed to use this command.',
      allowedRoles: 'You need a specific role to use this command.',
      blockedRoles: 'You have a role that is blocked from using this command.',
      restrictedToOwner: 'Only the bot owner can use this command.',
      restrictedToNSFW: 'This command can only be used in NSFW channels.',
      isDisabled: 'This command is currently disabled.',
      custom: 'You are not allowed to use this command.',
    },
    cooldowns: {
      user: 'You can use this command again in {time} seconds.',
      guild: 'This command is on cooldown for this server. Try again in {time} seconds.',
      global: 'This command is on global cooldown. Try again in {time} seconds.',
    },
  },

  logChannelConfig: {
    channelId: 'YOUR_LOG_CHANNEL_ID',
    message: async (
      context: Interaction | ContextMenuCommandInteraction | Message,
      commandName: string,
      commandType: string,
    ): Promise<MessageReplyOptions> => {
      const authorId: string = context instanceof Message ? context.author.id : context.user.id;
      const authorIconURL: string =
        context instanceof Message ? context.author.displayAvatarURL() : context.user.displayAvatarURL();

      const messageURL: string | undefined =
        context.guild && context.channel
          ? `https://discord.com/channels/${context.guild.id}/${context.channel.id}/${context.id}`
          : undefined;

      const logEmbed: EmbedBuilder = new EmbedBuilder()
        .setTitle(`${commandType} triggered`)
        .setColor('Blurple')
        .setDescription(
          `**${commandType}**: \`${commandName}\`\n**User**: <@${authorId}>\n**Channel**: <#${context.channel?.id}>`,
        )
        .setThumbnail(authorIconURL)
        .setTimestamp();

      const isEphemeralInteraction = !(context instanceof Message) && 'ephemeral' in context && context.ephemeral;

      if (messageURL && !isEphemeralInteraction) {
        logEmbed.setURL(messageURL);
      }

      return {
        embeds: [logEmbed],
      };
    },
  },
};

export default defaultConfig;
