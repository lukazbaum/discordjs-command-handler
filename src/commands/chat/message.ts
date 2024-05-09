import { Message } from "discord.js";
import { CommandTypes, MessageCommandModule } from "../../handler";

export = {
    name: "Hello",
    type: CommandTypes.MessageCommand,
    async execute(message: Message): Promise<void> {
        await message.reply(`Hello <@${message.author.id}>`);
    }
} as MessageCommandModule;