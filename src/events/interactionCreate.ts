import { Events } from "discord.js";
import type { Interaction } from "discord.js";
import type { BotClient } from "../client.ts";
import type { Event } from "../types/bot.ts";

const event: Event = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction, client: BotClient) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      await interaction.reply({
        content: "Unknown command.",
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(
        `[ERROR] Failed running command "${interaction.commandName}":`,
        error,
      );

      const message = "There was an error while running this command.";

      if (interaction.deferred || interaction.replied) {
        await interaction
          .editReply({ content: message, embeds: [] })
          .catch(() => undefined);
      } else {
        await interaction
          .reply({ content: message, ephemeral: true })
          .catch(() => undefined);
      }
    }
  },
};

export default event;
