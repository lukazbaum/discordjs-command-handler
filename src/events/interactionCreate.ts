import { Events, Interaction } from "discord.js";
import { EventModule } from "../handler/types/EventModule";
import { handleComponents } from "../handler/util/handleComponents";
import { handleInteractionCommands } from "../handler/util/handleInteractionCommands";

export = {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction): Promise<void> {
        // Handles Slash Commands and Context Menus.
        await handleInteractionCommands(interaction);
        // Handles Buttons, Select Menus and Modals.
        await handleComponents(interaction);
    }
} as EventModule;