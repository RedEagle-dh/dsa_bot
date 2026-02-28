import { GatewayIntentBits } from "discord.js";
import { BotClient } from "./client.ts";
import { config } from "./config.ts";
import { loadCommands } from "./handlers/loadCommands.ts";
import { loadEvents } from "./handlers/loadEvents.ts";

const client = new BotClient({
  intents: [GatewayIntentBits.Guilds],
});

const loadedCommands = await loadCommands(client, new URL("./commands/", import.meta.url));
const loadedEvents = await loadEvents(client, new URL("./events/", import.meta.url));

console.log(`[BOOT] Loaded ${loadedCommands} command(s) and ${loadedEvents} event(s).`);

await client.login(config.token);
