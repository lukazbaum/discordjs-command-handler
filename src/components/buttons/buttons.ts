import { Button } from '../../handler';
import type { ButtonInteraction } from 'discord.js';

export default new Button({
  customId: 'buttons',

  async execute(interaction: ButtonInteraction, uniqueId: string | null): Promise<void> {
    await interaction.reply({
      content: `You have pressed the **${uniqueId}** button.`,
      ephemeral: true,
    });
  },
});
