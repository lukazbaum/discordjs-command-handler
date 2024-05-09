import { Events } from "discord.js";

export interface EventModule {
    name: Events;
    once?: boolean;
    execute: (...args: any[]) => Promise<void>;
}