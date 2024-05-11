import { Collection } from "discord.js";

export interface ComponentModule {
    id?: string;
    group?: string;
    type: ComponentTypes;
    execute: (interaction: any) => Promise<void>;
}

export interface ComponentCollections {
    buttons: Collection<string, ComponentModule>;
    selectMenus: Collection<string, ComponentModule>;
    modals: Collection<string, ComponentModule>;
}

export enum ComponentTypes {
    Button = "buttons",
    SelectMenu = "selectMenus",
    Modal = "modals"
}