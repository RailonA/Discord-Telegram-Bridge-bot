const fs = require("fs");
const Telegram = require('node-telegram-bot-api');
// const fetch = require('cross-fetch');


// replace the value below with the Telegram token you receive from @BotFather

const tokens = JSON.parse(fs.readFileSync("./tokens/tokens.json", "utf8"));

// Create a TelegramBot that uses 'polling' to fetch new updates
const TelegramBot = new Telegram(tokens.telegram, { polling: true });

const startDate = new Date();

// const commands = require("./../commands");
const twitter_API = require("./../src/scripts/twitter_API");
// const finnhub_API = require("./../src/scripts/finnhub_API");

// console.log(twitter_API)
async function getTweet() {
  const k =  await twitter_API.tweet.get()
  console.log(k)
}

try {
  TelegramBot.on('message', async (message) => {
    if (new Date(message.date * 1000) > startDate && message.text) {
      console.log("Got a telegram message: " + message.text);

      const chatId = message.chat.id;

      //populate object with Telegram information
      let plateformObject = {
        platform: "telegram",
        userID: message.from.id,
        message: message,
        chatID: message.chat.id
      }
      // let forexNewsTweets = await twitter_API;
    // await twitter_API.tweet;
    TelegramBot.sendMessage(chatId, 'NEW TWEET:');
  //   console.log(twitter_API)
  //  TelegramBot.sendMessage(chatId, twitter_API.tweet.get(),   { parse_mode: 'html' });

  TelegramBot.sendMessage(chatId, getTweet());

   // send a message to the chat acknowledging receipt of their message
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
} catch (e) {
  Rollbar.error("Something went wrong", e);
  console.log("Something went wrong", e);
}


const rwClient = require("./scripts/twitter_API.js");
const cronJob = require("cron").CronJob;


const forexNewsTweets = async () => {
  
  try {
    const userTimeline = await rwClient.v1.userTimelineByUsername("@ForexLive");
    const fetchedTweets = userTimeline.tweets;

    console.log(fetchedTweets[0].full_text)

    // for await (const tweet of fetchedTweets) {
    //   const tweeted = tweet.full_text
    //   console.log('TWEET: ' + tweeted);

    // }

  } catch (e) {
    console.log(e)

  }

}

forexNewsTweets()

// Tweets every day at 10 am
// const job = new cronJob(" * 10 * * *", () => {
//   console.log("RUNNING")
//   tweet()
// })

// job.start()
