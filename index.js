// import dotenv and config
import { config } from "dotenv";
import * as fs from "node:fs";
import path from "node:path";
import { scrubIdFromMessage } from "./utils.js";
// import Client and GatewayIntentBits from discord.js
import {
  GatewayIntentBits,
  Client,
  Events,
  Collection,
  MessageFlags,
} from "discord.js";
import { createRequire } from "node:module";

config();

const require = createRequire(import.meta.url);

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

const foldersPath = path.join(import.meta.dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  // change to async?
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // set a new item in the collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`,
      );
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  // how to log the incoming interaction
  console.log(interaction);
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.log(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: `There was an error while executing this command!`,
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: `There was an error while executing this command!`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

// listen for new messages every time it happens
client.on(Events.MessageCreate, async (message) => {
  try {
    // prevent the infinite loop by inspecting the author of the message and break the loop if the author is a bot.

    if (message.author.bot) {
      console.log(`Bot response found...`);
      return;
    }

    // condition to check if the bot was "mentioned" in the message and proceed if it was
    if (message.mentions.has(client.user.id)) {
      console.log(`The user is talking to me...`);

      // get the content
      const userMessage = scrubIdFromMessage(message.content);
      console.log(`The user asked: "${userMessage}"`);

      // fetch the previous 6 messages to use as context.
      const previousMessages = await message.channel.messages.fetch({ limit: 6 });

      let formattedMessages = Array.from(previousMessages.values()).reverse();

      // create the conversation history
      let converstationHistory = []
      for (let i = 0; i < formattedMessages.length; i++) {
        const cleanMessage = scrubIdFromMessage(formattedMessages[i].content);
        formattedMessages[i].author.id === client.user.id ? converstationHistory.push({ 'role': 'assistant', 'content': `${cleanMessage}` }) : converstationHistory.push({ 'role': 'user', 'content': `${cleanMessage}` });
      }

      // call the fetch to the local api
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: 'llama3.2',
          messages: converstationHistory,
          stream: false
        }),
      });

      // format and return the data
      const data = await response.json();
      const replyMessage = data.message.content;
      await message.reply(replyMessage);
    }
  }
  catch(error){
    console.error(error.message);
  }
});
