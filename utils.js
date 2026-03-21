export function scrubIdFromMessage(message) {
  let scrubbedMessage = message.replace(/^<@\d+>\s+/, "");
  return scrubbedMessage;
}
