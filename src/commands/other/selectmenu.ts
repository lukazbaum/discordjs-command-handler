import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../handler";
import {
    ActionRowBuilder,
    CommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    StringSelectMenuBuilder
} from "discord.js";

export = {
    type: CommandTypes.SlashCommand,
    register: RegisterTypes.Guild,
    data: new SlashCommandBuilder()
        .setName("selectmenu")
        .setDescription("Replies with a selectmenu!")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction: CommandInteraction): Promise<void> {
        const row: any = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("select")
                    .setPlaceholder("Nothing selected")
                    .setMinValues(1)
                    .setMaxValues(2)
                    .addOptions(
                        {
                            label: "Select me",
                            description: "This is a description",
                            value: "firstOption",
                        },
                        {
                            label: "You can select me too",
                            description: "This is also a description",
                            value: "secondOption",
                            emoji: "😱"
                        },
                        {
                            label: "I am also an option",
                            description: "This is a description as well",
                            value: "thirdOption",
                        },
                    ),
            );
        await interaction.reply({ content: "Wow!", components: [row] });
    }
} as SlashCommandModule;