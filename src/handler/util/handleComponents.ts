import { glob } from "glob";
import Logger from "./Logger";
import { client } from "../../index";
import { Interaction } from "discord.js";
import { DiscordClient } from "./DiscordClient";
import { componentsFolderName } from "../../config";
import { ComponentModule, ComponentTypes } from "../types/Component";

export async function registerComponents(client: DiscordClient): Promise<void> {
    let componentPaths: string[] = await glob(`**/${componentsFolderName}/**/**/*.js`);

    for (const component of componentPaths) {
        let importPath: string = `../..${component.replace(/^dist[\\\/]|\\/g, "/")}`;
        try {
            let module: ComponentModule = (await import(importPath)).default;
            if (module.type === ComponentTypes.Button) {
                if (module.id) client.components.buttons.set(module.id, module);
                else if (module.group) client.components.buttons.set(module.group, module);
            } else if (module.type === ComponentTypes.SelectMenu) {
                if (module.id) client.components.selectMenus.set(module.id, module);
                else if (module.group) client.components.selectMenus.set(module.group, module);
            } else if (module.type === ComponentTypes.Modal) {
                if (module.id) client.components.modals.set(module.id, module);
                else if (module.group) client.components.modals.set(module.group, module);
            }
        } catch (err) {
            Logger.error(`Failed to load component at ${importPath}`);
        }
    }
}

export async function handleComponents(interaction: Interaction): Promise<void> {
    if (interaction.isButton()) {
        let id;
        if (interaction.customId.includes("group=")) {
            id = interaction.customId.split(";")[0].replace(/group=|;/g, "");
            interaction.customId = interaction.customId.split(";")[1];
        } else {
            id = interaction.customId;
        }

        const component: ComponentModule | undefined = client.components.buttons.get(id);
        if (!component) return Logger.error(`No component matching ${interaction.customId} was found.`);

        try {
            await component.execute(interaction);
        } catch (err) {
            return Logger.error(`Error executing ${id}`, err);
        }
    }

    if (interaction.isAnySelectMenu()) {
        let id;
        if (interaction.customId.includes("group=")) {
            id = interaction.customId.split(";")[0].replace(/group=|;/g, "");
            interaction.customId = interaction.customId.split(";")[1];
        } else {
            id = interaction.customId;
        }

        const component: ComponentModule | undefined = client.components.selectMenus.get(id);
        if (!component) return Logger.error(`No component matching ${interaction.customId} was found.`);

        try {
            await component.execute(interaction);
        } catch (err) {
            return Logger.error(`Error executing ${id}`, err);
        }
    }

    if (interaction.isModalSubmit()) {
        const component: ComponentModule | undefined = client.components.modals.get(interaction.customId);
        if (!component) return Logger.error(`No component matching ${interaction.customId} was found.`);
        if (component.group) return Logger.error(`The parameter group in ${interaction.customId} is not allowed.`);

        try {
            await component.execute(interaction);
        } catch (err) {
            return Logger.error(`Error executing ${interaction.customId}`, err);
        }
    }
}