import { SlashCommandBuilder } from "discord.js";
import { saveUserMemory } from "../../utils.js";

export const data = new SlashCommandBuilder().setName("forget").setDescription("Removes all known memories about the user from the bot.");

export async function execute(interaction) {
  const userId = interaction.user.id;
  await saveUserMemory(userId, { "facts": [] });
  await interaction.reply(`Okay ${interaction.user.username}, I have erased my memories of you.`)
};