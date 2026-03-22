export function scrubIdFromMessage(message) {
  let scrubbedMessage = message.replace(/<@[\w\d]+>/, "");
  return scrubbedMessage;
}


export function chunkMessage(message, maxLength = 1999) {
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
