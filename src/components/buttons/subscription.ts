import { ButtonInteraction } from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";

export = {
    group: "subscription",
    type: ComponentTypes.Button,
    async execute(interaction: ButtonInteraction): Promise<void> {
        if (interaction.customId === "confirm") {
            await interaction.reply({ content: "Pressed confirm" });
        } else if (interaction.customId === "cancel") {
            await interaction.reply({ content: "Pressed cancel" });
        }
    }
} as ComponentModule;