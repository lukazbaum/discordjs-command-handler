import 'dotenv/config';
import { AutomaticIntents } from "./handler/types/Intent";
import { DiscordClient } from "./handler/util/DiscordClient";

export const client: DiscordClient = new DiscordClient({
    // "AutomaticIntents" will provide your client with all necessary Intents.
    // By default, two specific Intents are enabled (Guilds, & MessageContent).
    // For details or modifications, see the config.ts file.
    // Manually adding Intents also works.
    intents: AutomaticIntents
});

(async (): Promise<void> => {
    // You can modify the "events", "components" and "commands" folder name in the config.ts file.
    // All directory's can have subfolders, subfolders in subfolders and even no subfolders.
    await client.registerEvents();
    await client.registerComponents();
    await client.registerCommands({
        // Whether to deploy your Slash Commands to the Discord API (refreshes command.data)
        // Not needed when just updating the execute function.
        // Keep in mind that guild commands will be deployed instantly and global commands can take up to one hour.
        deploy: true
    });
    await client.connect(process.env.CLIENT_TOKEN);
})();