import { Events } from "discord.js";
import type { Client } from "discord.js";
import type { BotClient } from "../client.ts";
import type { Event } from "../types/bot.ts";
import { syncSlashCommands } from "../utils/syncSlashCommands.ts";

const event: Event = {
  name: Events.ClientReady,
  once: true,
  async execute(readyClient: Client<true>, client: BotClient) {
    console.log(`[READY] Logged in as ${readyClient.user.tag}`);

    try {
      await syncSlashCommands(client);
      console.log("[READY] Synced slash commands globally.");
    } catch (error) {
      console.error("[READY] Failed to sync slash commands:", error);
    }
  },
};

export default event;
