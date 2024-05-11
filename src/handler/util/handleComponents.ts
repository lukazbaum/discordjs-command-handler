import { glob } from "glob";
import Logger from "./Logger";
import { client } from "../../index";
import { Interaction } from "discord.js";
import { DiscordClient } from "./DiscordClient";
import { componentsFolderName } from "../../config";
import { ComponentModule, ComponentTypes } from "../types/Component";

export async function registerComponents(client: DiscordClient): Promise<void> {
    let componentPaths: string[] = await glob(`**/${componentsFolderName}/**/**/*.js`);

    for (const componentPath of componentPaths) {
        const importPath: string = `../..${componentPath.replace(/^dist[\\\/]|\\/g, "/")}`;
        try {
            const module: ComponentModule = (await import(importPath)).default;
            if (module.id) client.components[module.type].set(module.id, module);
            else if (module.group) client.components[module.type].set(module.group, module);
        } catch (err) {
            Logger.error(`Failed to load component at ${importPath}`, err);
        }
    }
}

export async function handleComponents(interaction: Interaction): Promise<void> {
    let customId: string = "";
    if (interaction.isButton() || interaction.isAnySelectMenu()) {
        customId = interaction.customId.includes("group=")
            ? interaction.customId.split(";")[0].replace(/group=|;/g, "")
            : interaction.customId;

        interaction.customId = interaction.customId.includes("group=")
            ? interaction.customId.split(";")[1]
            : interaction.customId;
    } else if (interaction.isModalSubmit()) customId = interaction.customId;

    if (customId === "") return Logger.error("The component id could not be filtered.", interaction);

    const component: ComponentModule | undefined = client.components[getComponentType(interaction)].get(customId);
    if (!component) return Logger.error(`No component matching ${customId} was found.`);
    if (interaction.isModalSubmit() && component.group) return Logger.error(`The parameter group in ${customId} is not allowed.`);

    try {
        await component.execute(interaction);
    } catch (err) {
        return Logger.error(`Error executing component with id: ${customId}`, err);
    }
}

function getComponentType(interaction: Interaction): ComponentTypes {
    if (interaction.isButton()) return ComponentTypes.Button;
    else if (interaction.isAnySelectMenu()) return ComponentTypes.SelectMenu;
    else return ComponentTypes.Modal;
}