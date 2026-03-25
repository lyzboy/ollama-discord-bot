import fs from "fs/promises"

export const scrubIdFromMessage = (message) => {
  let scrubbedMessage = message.replace(/<@[\w\d]+>/, "");
  return scrubbedMessage;
}


export const chunkMessage = (message, maxLength = 1999) => {
  const chunks = [];
  let currentIndex = 0;

  while (currentIndex < message.length) {
    let remainingLength = message.length - currentIndex;

    // If the rest of the message fits, push it and finish
    if (remainingLength <= maxLength) {
      chunks.push(message.slice(currentIndex));
      break;
    }

    // Grab a chunk of the max allowed size
    let tempSlice = message.slice(currentIndex, currentIndex + maxLength);

    // Try to split at the last newline first to preserve code blocks/formatting
    let splitIndex = tempSlice.lastIndexOf('\n');

    // If no newline, fall back to the last space
    if (splitIndex === -1) {
      splitIndex = tempSlice.lastIndexOf(' ');
    }

    // If no space or newline exists at all, just do a hard cut
    if (splitIndex === -1) {
      splitIndex = maxLength;
    }

    // Push the clean slice to our array
    chunks.push(message.slice(currentIndex, currentIndex + splitIndex));

    // Move the index forward. If we split on a space/newline, skip that character (+1)
    currentIndex += splitIndex + (splitIndex === maxLength ? 0 : 1);
  }

  return chunks;
}

export const loadUserMemory = async (userId) => {
  try {
    const content = await fs.readFile(`./memory/${userId}.json`, { encoding: 'utf8' });
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

export const saveUserMemory = async (userId, dataObject) => {
  try {
    const formattedObject = JSON.stringify(dataObject);
    await fs.writeFile(`./memory/${userId}.json`, formattedObject)
  }
  catch (error) {
    console.log(`Unable to write to file ${userId}`);
  }
}

export const extractUserMemory = async (userMessage, currentMemory) => {

  const memoryPrompt = `
    You are a strict data consolidation AI. Your job is to manage a user's memory file based on their latest message.
    CURRENT MEMORY: ${JSON.stringify(currentMemory.facts)}
    USER MESSAGE: "${userMessage}"

    CRITICAL RULES:
    1. CREATE: Extract new permanent, declarative facts about the user from the message. Format them starting with "The user" or "The user's".
    2. UPDATE: If the user message contradicts an existing fact in the CURRENT MEMORY, replace the old fact with the new truth.
    3. DELETE: If the user explicitly asks you to forget, delete, or remove a specific fact, remove it completely from the array. If they ask you to forget everything, clear the array.
    4. KEEP: Retain all existing facts from the CURRENT MEMORY that are not updated or deleted.
    5. IGNORE: Ignore questions, greetings, and statements the user makes about YOU (the AI).

    Examples:
    Message: "My name is Josh and I drive a Ford." -> {"new_facts": ["The user's name is Josh", "The user drives a Ford"]}
    Message: "Do you have access to the internet? Is your knowledge a snapshot?" -> {"new_facts": []}
    Message: "You are the brains behind this bot." -> {"new_facts": []}

    Return ONLY a raw JSON object with a single key 'new_facts' containing the completely updated array of strings. Do not include markdown formatting or conversational text.`;

  try {



    // call the fetch to the local api
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2",
        messages: [
          {
            role: "user",
            content: `${memoryPrompt}`,
          }
        ],
        stream: false,
      }),
    });

    // format and return the data
    const data = await response.json();
    let replyMessage = data.message.content;
    // Force-strip markdown code blocks that break JSON.parse
    replyMessage = replyMessage.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(replyMessage);
  } catch (error) {
    return { "new_facts": [] };
  }
}
