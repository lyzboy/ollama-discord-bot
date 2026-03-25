import { SlashCommandBuilder } from "discord.js";
import fs from "fs/promises";

export const data = new SlashCommandBuilder().setName("help").setDescription("Outputs a list of commands that LyzAssistant can complete.")

export async function execute(interaction) {
  const content = await fs.readFile(`./help.md`, { encoding: 'utf8' });
  await interaction.reply(content);

}