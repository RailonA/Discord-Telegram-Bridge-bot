const fs = require("fs");
const Telegram = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather

const tokens = JSON.parse(fs.readFileSync("./../tokens.json", "utf8"));

// Create a TelegramBot that uses 'polling' to fetch new updates
const TelegramBot = new Telegram(tokens.telegram, { polling: true });

const startDate = new Date();

// imports
const commands = require("./../commands");

async function handleMessage(text, args, platformObject) {
  //sends all od the information plus references to the bots to our command handler
  //this can be further abstracted to multiple command handlers if desired
  await commands.handle(text, args, platformObject, { telegram: TelegramBot });
}



// Matches "/echo [whatever]"
TelegramBot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.

TelegramBot.on('message', async (message) => {
  if (new Date(message.date * 1000) > startDate && message.text) {
    console.log("Got a telegram message: " + message.text);
  
    const chatId = message.chat.id;

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

    // send a message to the chat acknowledging receipt of their message
    TelegramBot.sendMessage(chatId, 'Received your message');

    return await handleMessage(message.text, args, plateformObject);
  } else if (message.text) {
    console.log("Skipping telegram message: " + message.text);
    return null;
  }
})
