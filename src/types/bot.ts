import type {
  ChatInputCommandInteraction,
  ClientEvents,
} from "discord.js";

export interface Command {
  data: {
    name: string;
    toJSON: () => unknown;
  };
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface Event {
  name: keyof ClientEvents;
  once?: boolean;
  execute: (...args: any[]) => Promise<void> | void;
}
