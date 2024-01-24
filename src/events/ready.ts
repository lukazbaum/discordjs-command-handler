import Logger from "../handler/util/Logger";
import { Events, ActivityType } from "discord.js";
import { UserStatus } from "../handler/types/UserStatus";
import { EventModule } from "../handler/types/EventModule";
import { DiscordClient } from "../handler/util/DiscordClient";

export = {
    name: Events.ClientReady,
    once: true,
    async execute(client: DiscordClient): Promise<void> {
        if (!client.user) return;

        client.user.setStatus(UserStatus.ONLINE);
        client.user.setActivity("Development", { type: ActivityType.Watching });
        Logger.log(`Ready! Logged in as ${client.user.tag}`);
    }
} as EventModule;