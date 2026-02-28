import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { BotClient } from "../client.ts";
import type { Command } from "../types/bot.ts";

export async function loadCommands(
  client: BotClient,
  commandsDirectory: URL,
): Promise<number> {
  const files = await collectRuntimeFiles(fileURLToPath(commandsDirectory));
  let loadedCount = 0;

  for (const file of files) {
    const module = await import(pathToFileURL(file).href);
    const command: Command | undefined = module.default;

    if (!command?.data || typeof command.execute !== "function") {
      console.warn(`[WARN] Skipping invalid command module: ${file}`);
      continue;
    }

    client.commands.set(command.data.name, command);
    loadedCount += 1;
  }

  return loadedCount;
}

async function collectRuntimeFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectRuntimeFiles(fullPath)));
      continue;
    }

    if (isRuntimeModule(entry.name)) {
      files.push(fullPath);
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function isRuntimeModule(fileName: string): boolean {
  if (fileName.endsWith(".d.ts")) {
    return false;
  }

  return fileName.endsWith(".ts") || fileName.endsWith(".js");
}
