import { BackgroundColor, Color, Format } from "../../handler/types/Formatting";
import { ColoredMessageBuilder } from "../../handler/util/ColoredMessageBuilder";
import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../handler/types/Command";

export = {
    type: CommandTypes.SlashCommand,
    register: RegisterTypes.Guild,
    data: new SlashCommandBuilder()
        .setName("color")
        .setDescription("Replies with a colored message!")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction: CommandInteraction): Promise<void> {
        const coloredMessage: string = new ColoredMessageBuilder()
            .add("Hello, ", Color.Red)
            .add("World!", Color.Blue, BackgroundColor.DarkBlue, Format.Underline)
            .addNewLine()
            .addRainbow("This is cool!", Format.Bold)
            .build();
        await interaction.reply({ content: coloredMessage });
    }
} as SlashCommandModule;