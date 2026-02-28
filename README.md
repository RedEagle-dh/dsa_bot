# dsa_bot

Minimal modular Discord bot with:
- `events/clientReady.ts`
- `events/interactionCreate.ts`
- `/help` slash command with usage overview
- `/dice` slash command with dice notation parsing

## Setup

Create environment variables:

```bash
cp .env.example .env
```

Required:
- `DISCORD_BOT_TOKEN` = your bot token

Install dependencies:

```bash
bun install
```

Run:

```bash
bun run start
# or watch mode
bun run dev
```

Slash commands are registered globally on startup (can take a little time to appear).

## Dice Command

Use `/dice` with optional `notation`:
- `d20`
- `2d6+3`
- `4d10-2`
- `d%` (percentile die)

Supported format: `XdY+Z`  
Limits: `1-100` dice, `2-1000` sides, modifier up to `+/-100000`.
