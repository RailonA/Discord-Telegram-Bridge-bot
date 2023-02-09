const fs = require("fs");
const Telegram = require('node-telegram-bot-api');
const Discord = require('discord.js');

// replace the value below with the Telegram token you receive from @BotFather

const tokens = JSON.parse(fs.readFileSync("./../tokens.json", "utf8"));
const prefixes = JSON.parse(fs.readFileSync("./../prefix.json", "utf8"));

// Create a TelegramBot that uses 'polling' to fetch new updates
// Create a DiscordBot 
const TelegramBot = new Telegram(tokens.telegram, { polling: true });
const DiscordBot = new Discord.Client();

const startDate = new Date();

// imports
const commands = require("./../commands");

async function handleMessage(text, args, platformObject) {
  //sends all od the information plus references to the bots to our command handler
  //this can be further abstracted to multiple command handlers if desired
  await commands.handle(text, args, platformObject, { telegram: TelegramBot, discord: DiscordBot });
}


DiscordBot.login(tokens.discord);
DiscordBot.on('ready', () => {
  console.log(`Discord is logged in as ${DiscordBot.user.tag}!`);
});

DiscordBot.on('message', async (message) => {
  if (new Date(message.creatrdTimesramp) > startDate) {
    console.log("Got a discord message: " + message.content);

    //populate object with Discord information
    let plateformObject = {
      platform: "discord",
      userID: message.auther.id,
      message: message,
      chatID: null
    }

    //Used to determine command and parameters
    let args = message.content.toLowerCase().split(" ");

    //to support different command prefixes on Discord and Telegram, we transform[0] from the Discord Prefix to the Telegram Prefix here
    //this way we only have to check for a single string in the command handler(s)
    if (args[0][0] == prefixes.discord)
      args[0] = prefixes.telegram + args[0].substring(1);
    else if (args[0][0] == prefixes.telegram)
      args[0] = args[0].substring(1);

    return await handleMessage(message.content, args, platformObject);
  } else {
    console.log("Skipping discord message: " + message.content);
    return null;
  }
});

TelegramBot.on('message', async (message) => {
  if (new Date(message.date * 1000) > startDate && message.text) {
    console.log("Got a telegram message: " + message.text);

    //populate object with Telegram information
    let plateformObject = {
      platform: "telegram",
      userID: message.from.id,
      message: message,
      chatID: message.chat.idull
    }

    //Used to determine command and parameters
    let args = message.text.toLowerCase().split(" ");
    if (args[0].indexOf("@") > -1) {
      // change /command@BotUserName to /command, really should check for equality with username
      args[0] = args[0].split("@")[0]
    }

    return await handleMessage(message.text, args, plateformObject);
  } else if (message.text) {
    console.log("Skipping telegram message: " + message.text);
    return null;
  }
})
// // Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// // Listen for any kind of message. There are different kinds of
// // messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message');
// });