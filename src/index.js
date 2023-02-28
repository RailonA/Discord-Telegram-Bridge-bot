const fs = require("fs");
const Telegram = require('node-telegram-bot-api');
// const cronJob = require("cron").CronJob;
const schedule = require('node-schedule');
const rwClient = require("./scripts/twitter_API.js");

const tokens = JSON.parse(fs.readFileSync("./tokens/tokens.json", "utf8"));

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

      const forexLiveTimeline = await rwClient.v1.userTimelineByUsername("@ForexLive");
      let fetchedOldTweets = forexLiveTimeline.tweets;

      // Checking Twitter page 12 am for new tweet
      let job = schedule.scheduleJob('2 * * * * * *', async function () {
        // const forexLiveTimeline = await rwClient.v1.userTimelineByUsername("@ForexLive");
        let fetchedNewTweets = forexLiveTimeline.tweets;
        let getNewTweet = fetchedNewTweets[0].full_text;

        if (getNewTweet !== fetchedOldTweets) {
          TelegramBot.sendMessage(plateformObject.chatID, '@ForexLive Tweeted:');
          TelegramBot.sendMessage(plateformObject.chatID, fetchedNewTweets[0].full_text)
          fetchedOldTweets = getNewTweet
        } else if (getNewTweet === fetchedOldTweets) {
          console.log("DON'T PRINT OLD TWEET")
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

