import { Modal } from '../../handler';
import { ModalSubmitFields, ModalSubmitInteraction } from 'discord.js';

export default new Modal({
  customId: 'askModal',

  async execute(interaction: ModalSubmitInteraction, fields: ModalSubmitFields): Promise<void> {
    const favoriteColor: string = fields.getTextInputValue('favoriteColor');
    const hobbies: string = fields.getTextInputValue('hobbies');

    await interaction.reply({
      content: `Your favorite color is **${favoriteColor}** and you enjoy **${hobbies}**!`,
      ephemeral: true,
    });
  },
});
