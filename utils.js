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

export const extractUserMemory = async (userMessage) => {

  const memoryPrompt = `You are a data extraction bot. Analyze this user message: '${userMessage}'. Extract any personal facts, preferences, or explicit requests to remember something. Return ONLY a raw JSON object with a single key 'new_facts' containing an array of strings. If there is nothing to remember, return {"new_facts": []}. Do not include markdown formatting, code blocks, or conversational text.`

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
    const replyMessage = data.message.content;
    return JSON.parse(replyMessage);
  } catch (error) {
    return { "new_facts": [] };
  }
}
