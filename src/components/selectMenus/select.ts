import { AnySelectMenuInteraction } from "discord.js";
import { ComponentModule, ComponentTypes } from "../../handler";

export = {
    id: "select",
    type: ComponentTypes.SelectMenu,
    async execute(interaction: AnySelectMenuInteraction): Promise<void> {
        await interaction.reply({ content: `You selected ${interaction.values}` })
    }
} as ComponentModule;