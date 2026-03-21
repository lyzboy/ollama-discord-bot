// import dotenv and config
import { config } from "dotenv";
import * as fs from "node:fs";
import path from "node:path";
// import Client and GatewayIntentBits from discord.js
import {
  GatewayIntentBits,
  Client,
  Events,
  Collection,
  MessageFlags,
} from "discord.js";

config();

// discord token
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// create a new discord client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// create event listener for when client is ready
// log message "Bot is online"
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Bot is online as ${readyClient.user.tag}`);
});

// have client login() using DISCORD_TOKEN
client.login(DISCORD_TOKEN);

client.commands = new Collection();

// listen for new messages every time it happens

// prevent the infinite loop by inspecting the author of the message and break the loop if the author is a bot.

// condition to check if the bot was "mentioned" in the message and proceed if it was

// get the context
// get the channel object from the message
// fecth the previous 6 messages to use as context.
