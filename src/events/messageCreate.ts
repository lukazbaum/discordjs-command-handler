import { Events, Message } from "discord.js";
import { EventModule } from "../handler/types/EventModule";
import { handleMessageCommands } from "../handler/util/handleChatCommands";

export = {
    name: Events.MessageCreate,
    async execute(message: Message): Promise<void> {
        if(message.author.bot) return;
        // Handles Prefix, Ping and Message commands.
        await handleMessageCommands(message);
    }
} as EventModule;