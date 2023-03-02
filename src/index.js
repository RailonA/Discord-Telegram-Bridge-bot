const fs = require("fs");
const Telegram = require('node-telegram-bot-api');
// const cronJob = require("cron").CronJob;
const schedule = require('node-schedule');
const rwClient = require("./scripts/twitter_API.js");
const { Console } = require("console");

const tokens = JSON.parse(fs.readFileSync("./tokens/telegram_token.json", "utf8"));

// Create a TelegramBot that uses 'polling' to fetch new updates
const TelegramBot = new Telegram(tokens.telegram, { polling: true });
const startDate = new Date();

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

// let job = schedule.scheduleJob('* * * * * *', function () {
//   let railonTimeline = await rwClient.v1.userTimelineByUsername("@railonacosta");
//   const fetchedTweets = railonTimeline.tweets;})

// job.start

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

      let   currentweet = "";

      // Checking Twitter page 12 am for new tweet
      let job = schedule.scheduleJob(' 0 * * * *', async function () {
        const forexLiveTimeline = await rwClient.v1.userTimelineByUsername("@ForexLive");
        let tweetList = forexLiveTimeline.tweets;
        let tweet = tweetList[0].full_text
        
        if (tweet !== currentweet) {
          TelegramBot.sendMessage(plateformObject.chatID, '@ForexLive Tweeted:');
          TelegramBot.sendMessage(plateformObject.chatID, tweet)
          currentweet = tweet;
          return currentweet
        } else {
          console.log("DONT PRINT ")
        }
      })

      job.start


    } else if (message.text) {
      console.log("Skipping telegram message: " + message.text);
      return null;
    }
  })
} catch (e) {
  Rollbar.error("Something went wrong", e);
  console.log("Something went wrong", e);
}

