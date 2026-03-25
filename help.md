LyzAssistant has many features that allow you interact with it in different ways.

- **@LyzAssistant <*your inquiry*>** : Replies to your input utilizing the Llama3.2 LLM. If the reply is < 2000 characters, the bot will reply in the main channel. If it is >= 2000 characters, the bot will create a new thread and direct you to go there to view the reply.

  - In main channel : the bot will utilize the last 6 messages in the channel for context, along with the memory stored for the user who is chatting, to reply to your inquiry.
  - In the thread : the bot will utilize the last 30 messages in the thread for context, along with the memory stored for the user who is chatting, to reply to your inquiry.
- **/help** : outputs a list of commands that the bot will accept