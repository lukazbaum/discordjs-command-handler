import { Message } from "discord.js";
import { CommandTypes, PingCommandModule } from "../../handler/types/Command";

export = {
    name: "help",
    type: CommandTypes.PingCommand,
    async execute(message: Message): Promise<void> {
        await message.reply("How can I help you?");
    }
} as PingCommandModule;