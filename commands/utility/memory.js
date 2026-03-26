import { SlashCommandBuilder } from "discord.js";
import fs from "fs/promises";

export const data = new SlashCommandBuilder().setName("memory").setDescription("Used to view the long term memory lyz assistant has stored about the user.");

export async function execute(interaction) {
  try {
    const userId = interaction.user.id;
    const rawMemory = await fs.readFile(`./memory/${userId}.json`, "utf-8");
    const parsedMemory = JSON.parse(rawMemory);
    if (parsedMemory.facts && parsedMemory.facts.length > 0) {
      let replyString = `The memory I have for **${interaction.user.username}** is:\n`;
      console.log(`Memory was found`);

      for (let i = 0; i < parsedMemory.facts.length; i++) {
        replyString += `- ${parsedMemory.facts[i]}\n`;
      }

      await interaction.reply(replyString);
      return;
    }

    await interaction.reply(`There is no memory for the user ${interaction.user.username}`)

  } catch (error) {
    await interaction.reply(`There is no memory for the user ${interaction.user.username}`)
  }
}