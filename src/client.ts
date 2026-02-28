import { Client, Collection } from "discord.js";
import type { Command } from "./types/bot.ts";

export class BotClient extends Client {
  public readonly commands = new Collection<string, Command>();
}
