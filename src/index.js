const fs = require("fs");
const Telegram = require('node-telegram-bot-api');
const cronJob = require("cron").CronJob;
const rwClient = require("./scripts/twitter_API.js");

const tokens = JSON.parse(fs.readFileSync("./tokens/tokens.json", "utf8"));

// Create a TelegramBot that uses 'polling' to fetch new updates
const TelegramBot = new Telegram(tokens.telegram, { polling: true });
const startDate = new Date();


try {
  TelegramBot.on('message', async (message) => {
    if (new Date(message.date * 1000) > startDate && message.text) {
      console.log("Got a telegram message: " + message.text);


      //populate object with Telegram information
      let plateformObject = {
        platform: "telegram",
        userID: message.from.id,
        message: message,
        chatID: message.chat.id
      }

      TelegramBot.sendMessage(plateformObject.chatID, 'NEW TWEET:');
      // forexNewsTweets()
      const userTimeline = await rwClient.v1.userTimelineByUsername("@ForexLive");
      const fetchedTweets = userTimeline.tweets;

      TelegramBot.sendMessage(plateformObject.chatID, fetchedTweets[0].full_text)
      // send a message to the chat acknowledging receipt of their message
      //Used to determine command and parameters
      let args = message.text.toLowerCase().split(" ");
      if (args[0].indexOf("@") > -1) {
        // change /command@BotUserName to /command, really should check for equality with username
        args[0] = args[0].split("@")[0]
      }

    } else if (message.text) {
      console.log("Skipping telegram message: " + message.text);
      return null;
    }
  })
} catch (e) {
  Rollbar.error("Something went wrong", e);
  console.log("Something went wrong", e);
}


// Tweets every day at 10 am
// const job = new cronJob(" * 10 * * *", () => {
//   console.log("RUNNING")
//   tweet()
// })

// job.start()
