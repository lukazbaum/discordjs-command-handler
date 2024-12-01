import { EmbedPaginator, RegisterType, SlashCommand } from '../../../handler';
import { type ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default new SlashCommand({
  registerType: RegisterType.Guild,

  data: new SlashCommandBuilder()
    .setName('pages')
    .setDescription('Browse through pages of information!'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const pages: EmbedBuilder[] = [
      new EmbedBuilder()
        .setTitle('Welcome to the Paginator')
        .setDescription('This is **Page 1** of the paginator.')
        .setColor(Colors.Blue),
      new EmbedBuilder()
        .setTitle('Page 2')
        .setDescription('Here is some more information on **Page 2**.')
        .setColor(Colors.Green),
      new EmbedBuilder()
        .setTitle('Page 3')
        .setDescription('Finally, this is **Page 3**. Enjoy!')
        .setColor(Colors.Red),
    ];

    const paginator: EmbedPaginator = new EmbedPaginator({
      pages,
      timeout: 60,
      autoPageDisplay: true,
    });

    await paginator.send({ context: interaction });
  },
});
