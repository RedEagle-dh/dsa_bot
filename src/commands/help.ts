import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types/bot.ts";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show available commands and how to use them"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("DSA Bot Help")
      .setDescription("Here are the commands you can use right now:")
      .addFields(
        {
          name: "/dice [notation]",
          value:
            "Roll dice using notation like `d20`, `2d6+3`, `4d10-2`, or `d%`.",
        },
        {
          name: "Examples",
          value: "`/dice` • `/dice notation:d20` • `/dice notation:3d8+2`",
        },
        {
          name: "Notation Format",
          value: "`XdY+Z` where `X` = count, `Y` = sides, `Z` = modifier.",
        },
      )
      .setFooter({ text: "Tip: Use /dice without notation for a default 1d6 roll." })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
