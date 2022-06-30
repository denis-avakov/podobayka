import dotenv from 'dotenv';
import discord, { Intents } from 'discord.js';

dotenv.config();

if (!process.env.DISCORD_BOT_TOKEN) {
  throw new Error('No bot token found!');
}

const client = new discord.Client({
  intents: [Intents.FLAGS.GUILDS],
  partials: ['CHANNEL']
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

// Wake the f..., Samurai 🤖
client.login(process.env.DISCORD_BOT_TOKEN);
