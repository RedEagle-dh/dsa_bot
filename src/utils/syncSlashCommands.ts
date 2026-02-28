import { REST, Routes } from "discord.js";
import type { BotClient } from "../client.ts";
import { config } from "../config.ts";

export async function syncSlashCommands(client: BotClient): Promise<void> {
  if (!client.user) {
    throw new Error("Cannot sync commands before the client is ready.");
  }

  const commandData = client.commands.map((command) => command.data.toJSON());
  const rest = new REST({ version: "10" }).setToken(config.token);
  const route = Routes.applicationCommands(client.user.id);

  await rest.put(route, { body: commandData });
}
