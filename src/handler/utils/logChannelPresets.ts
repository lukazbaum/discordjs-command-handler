import { type ContextMenuCommandInteraction, EmbedBuilder, type Interaction, Message } from 'discord.js';

export function getLogChannelPresetEmbed(
  context: Interaction | ContextMenuCommandInteraction | Message,
  commandName: string,
  commandType: string,
): EmbedBuilder {
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

  const isEphemeralInteraction: boolean | null =
    !(context instanceof Message) && 'ephemeral' in context && context.ephemeral;

  if (messageURL && !isEphemeralInteraction) {
    logEmbed.setURL(messageURL);
  }

  return logEmbed;
}
