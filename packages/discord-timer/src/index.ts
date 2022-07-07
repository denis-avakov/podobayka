import dotenv from 'dotenv';
import discord, { Intents } from 'discord.js';

dotenv.config();

const tokens = [
  process.env.DISCORD_PODOBAYKA_TOKEN,
  process.env.DISCORD_SIRENACHAN_TOKEN,
  process.env.DISCORD_NEONBONBON_TOKEN,
  process.env.DISCORD_SOOONYAN_TOKEN,
  process.env.DISCORD_WANESSATOXIC_TOKEN,
  process.env.DISCORD_ALYSQUE_TOKEN
];

if (tokens.some((token) => !token)) {
  throw new Error('Not all discord tokens are set');
}

for (const token of tokens) {
  const bot = new discord.Client({
    intents: [Intents.FLAGS.GUILDS],
    partials: ['CHANNEL']
  });

  bot.on('ready', () => {
    console.log(`Logged in as ${bot.user?.tag}!`);
  });

  // WAKE UP, Samurai 🤖
  bot.login(token);
}
