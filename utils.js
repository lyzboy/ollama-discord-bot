export function scrubIdFromMessage(message) {
  let scrubbedMessage = message.replace(/<@[\w\d]+>/, "");
  return scrubbedMessage;
}
