const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
  throw new Error("Missing DISCORD_BOT_TOKEN environment variable.");
}

export const config = {
  token,
};
