// import dotenv and config
import { config } from 'dotenv';
// import Client and GatewayIntentBits from discord.js
import {GatewayIntentBits, Client, Events} from 'discord.js';

config();

// discord token
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;


// create a new discord client instance
const client = new Client({intents:[GatewayIntentBits.Guilds]});


// create event listener for when client is ready
// log message "Bot is online"
client.once(Events.ClientReady, (readyClient)=>{
    console.log(`Bot is online as ${readyClient.user.tag}`)
});

// have client login() using DISCORD_TOKEN
client.login(DISCORD_TOKEN);