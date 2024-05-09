import { ButtonInteraction } from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";

export = {
    id: "deleteMessage",
    type: ComponentTypes.Button,
    async execute(interaction: ButtonInteraction): Promise<void> {
        await interaction.message.delete();
    }
} as ComponentModule;