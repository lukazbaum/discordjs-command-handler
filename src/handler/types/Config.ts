import type { GatewayIntentBits } from 'discord.js';

export interface Config {
  prefix: string;
  ownerId?: string;
  eventsFolder: string;
  commandsFolder: string;
  componentsFolder: string;
  defaultIntents: GatewayIntentBits[];
  deniedCommandReplies: any;
}
