import type { ButtonStyle, EmbedBuilder, Interaction } from 'discord.js';

export enum PaginatorButtonType {
  First,
  Previous,
  Next,
  Last,
}

export interface PaginatorSettings {
  pages: EmbedBuilder[];
  timeout: number;
  buttons?: {
    type: PaginatorButtonType;
    label?: string;
    style?: ButtonStyle;
    emoji?: string;
  }[];
  showButtonsAfterTimeout?: boolean;
  hideFirstLastButtons?: boolean;
  loopPages?: boolean;
  autoPageDisplay?: boolean;
  restrictToAuthor?: boolean;
}

export interface PaginatorSendOptions {
  interaction: Interaction;
  ephemeral?: boolean;
  followUp?: boolean;
  content?: string;
}
