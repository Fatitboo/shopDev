"use strict";
const { Client, GatewayIntentBits } = require("discord.js");
const { CHANNELID_DISCORD, TOKEN_DISCORD } = process.env;
console.log(
  "🚀 ~ CHANNELID_DISCORD, TOKEN_DISCORD:",
  CHANNELID_DISCORD,
  TOKEN_DISCORD
);

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.channelId = CHANNELID_DISCORD;

    this.client.on("ready", () => {
      console.log(`Log is at ${this.client.user.tag}`);
    });

    this.client.login(TOKEN_DISCORD);
  }

  sendToFormatCode(logData) {
    const {
      code,
      message = "This is some additional information about the code.",
      title = "Code Example",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.error(`Coundn't find the channel..., ${this.channelId}`);
      return;
    }

    channel.send(codeMessage).catch((e) => {
      return console.error(e);
    });
  }

  sendToMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.error(`Coundn't find the channel..., ${this.channelId}`);
      return;
    }

    channel.send(message).catch((e) => {
      return console.error(e);
    });
  }
}
const loggerService = new LoggerService();

module.exports = loggerService;
