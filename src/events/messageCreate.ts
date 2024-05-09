import { EventModule } from "../handler";
import { Events, Message } from "discord.js";
import { handleMessageCommands } from "../handler/util/handleChatCommands";

export = {
    name: Events.MessageCreate,
    async execute(message: Message): Promise<void> {
        if(message.author.bot) return;
        // Handles Prefix, Ping and Message commands.
        await handleMessageCommands(message);
    }
} as EventModule;