import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { BotClient } from "../client.ts";
import type { Event } from "../types/bot.ts";

export async function loadEvents(
  client: BotClient,
  eventsDirectory: URL,
): Promise<number> {
  const files = await collectRuntimeFiles(fileURLToPath(eventsDirectory));
  let loadedCount = 0;

  for (const file of files) {
    const module = await import(pathToFileURL(file).href);
    const event: Event | undefined = module.default;

    if (!event?.name || typeof event.execute !== "function") {
      console.warn(`[WARN] Skipping invalid event module: ${file}`);
      continue;
    }

    const handler = (...args: any[]) => event.execute(...args, client);

    if (event.once) {
      client.once(event.name as never, handler as never);
    } else {
      client.on(event.name as never, handler as never);
    }

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
