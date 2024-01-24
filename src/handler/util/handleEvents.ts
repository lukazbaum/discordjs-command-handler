import { glob } from "glob";
import Logger from "./Logger";
import { eventsFolderName } from "../../config";
import { DiscordClient } from "./DiscordClient";
import { EventModule } from "../types/EventModule";

export async function registerEvents(client: DiscordClient): Promise<void> {
    let eventsPaths: string[] = await glob(`**/${eventsFolderName}/**/**/*.js`);

    for (const event of eventsPaths) {
        let importPath: string = `../..${event.replace(/^dist[\\\/]|\\/g, "/")}`;
        try {
            let eventModule: EventModule = (await import(importPath)).default;
            client.events.push(eventModule.name);
            if (eventModule.once) client.once(String(eventModule.name), (...args: any[]) => eventModule.execute(...args));
            else client.on(String(eventModule.name), (...args: any[]) => eventModule.execute(...args));
        } catch (err) {
            Logger.error(`Failed to load event at ${importPath}`);
        }
    }
}