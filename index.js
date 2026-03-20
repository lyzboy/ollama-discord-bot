// import dotenv and config
import { config } from 'dotenv';
// import Client and GatewayIntentBits from discord.js
import {GatewayIntentBits, Client} from 'discord.js';

config();

// discord token
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;


// create a new discord client instance
/**
 * Needed intents
 * - GatewayIntentBits
 * Guilds
 * GuildMessages
 * MessageContent
 * It will need to access private messages as well as channel messages and respond when using @botname
 */

// create event listener for when client is ready
// log message "Bot is online"

// have client login() using DISCORD_TOKEN
