import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../handler/types/Command";

export = {
    type: CommandTypes.SlashCommand,
    register: RegisterTypes.Guild,
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply({ content: "Pong" });
    }
} as SlashCommandModule;