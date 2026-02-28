import { randomInt } from "node:crypto";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types/bot.ts";

const DICE_PATTERN = /^\s*(\d*)d(\d+|%)\s*([+-]\s*\d+)?\s*$/i;
const MAX_DICE_COUNT = 100;
const MAX_DICE_SIDES = 1000;
const MAX_ABS_MODIFIER = 100000;

interface ParsedDiceNotation {
  count: number;
  sides: number;
  modifier: number;
  normalized: string;
}

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Roll any dice notation: d20, 2d6+1, 4d10-2, d%")
    .addStringOption((option) =>
      option
        .setName("notation")
        .setDescription("Dice notation in XdY+Z format (default: 1d6)")
        .setRequired(false),
    ),

  async execute(interaction) {
    const rawNotation = interaction.options.getString("notation") ?? "1d6";
    const parsed = parseDiceNotation(rawNotation);

    if (!parsed) {
      await interaction.reply({
        content:
          "Invalid notation. Use `XdY+Z` like `d20`, `2d6+1`, `4d10-2`, or `d%`.\nLimits: 1-100 dice, 2-1000 sides, modifier up to +/-100000.",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    const rolls = Array.from({ length: parsed.count }, () =>
      randomInt(1, parsed.sides + 1),
    );

    const subtotal = rolls.reduce((sum, value) => sum + value, 0);
    const total = subtotal + parsed.modifier;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("Dice Roll")
      .setDescription(`${interaction.user} rolled \`${parsed.normalized}\``)
      .addFields(
        { name: "Rolls", value: formatRolls(rolls), inline: false },
        { name: "Subtotal", value: `**${subtotal}**`, inline: true },
        {
          name: "Modifier",
          value: `${parsed.modifier >= 0 ? "+" : ""}${parsed.modifier}`,
          inline: true,
        },
        { name: "Total", value: `**${total}**`, inline: true },
      )
      .setFooter({ text: "May the odds be with you." })
      .setTimestamp();

    await interaction.editReply({
      content: "",
      embeds: [embed],
    });
  },
};

export default command;

function parseDiceNotation(input: string): ParsedDiceNotation | null {
  const match = input.match(DICE_PATTERN);
  if (!match) {
    return null;
  }

  const countRaw = match[1];
  const sidesRaw = match[2];
  const modifierRaw = match[3];

  if (!sidesRaw) {
    return null;
  }

  const count = countRaw ? Number.parseInt(countRaw, 10) : 1;
  const sides = sidesRaw === "%" ? 100 : Number.parseInt(sidesRaw, 10);
  const modifier = modifierRaw
    ? Number.parseInt(modifierRaw.replace(/\s+/g, ""), 10)
    : 0;

  if (!Number.isInteger(count) || !Number.isInteger(sides)) {
    return null;
  }

  if (
    count < 1 ||
    count > MAX_DICE_COUNT ||
    sides < 2 ||
    sides > MAX_DICE_SIDES
  ) {
    return null;
  }

  if (!Number.isInteger(modifier) || Math.abs(modifier) > MAX_ABS_MODIFIER) {
    return null;
  }

  const sideToken = sidesRaw === "%" ? "%" : `${sides}`;
  const normalized = `${count}d${sideToken}${formatModifier(modifier)}`;

  return { count, sides, modifier, normalized };
}

function formatModifier(modifier: number): string {
  if (modifier === 0) {
    return "";
  }

  return modifier > 0 ? `+${modifier}` : `${modifier}`;
}

function formatRolls(rolls: number[]): string {
  const formatted = rolls.map((value) => `\`${value}\``);

  if (formatted.length <= 20) {
    return formatted.join(" • ");
  }

  return `${formatted.slice(0, 20).join(" • ")} • ... (${rolls.length} total rolls)`;
}
