const fs = require("fs");
const Telegram = require('node-telegram-bot-api');
const cronJob = require("cron").CronJob;
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

let job = schedule.scheduleJob('* * * * * *', function () {
  console.log('The answer to life, the universe, and everything!');
})

job.start
  ;// async function getTweet () {
//   try {
//   const userTimeline = await rwClient.v1.userTimelineByUsername("@ForexLive");
//   const fetchedTweets = userTimeline.tweets;
//   console.log(fetchedTweets)
//   } catch (e) {
//     console.log(e)
//   }
// }

// console.log(getTweet)

async function checkForNewTweet(tweet) {
  // const value = oldvalue
  let oldTweet
  console.log('oldTweet')
  console.log(oldTweet)
  console.log('tweet')
  console.log(tweet)

  if (tweet !== oldTweet) {
    oldTweet = tweet
    console.log("PRINT TWEET")
  } else if (tweet === oldTweet) {
    console.log("DO NOT PRINT TWEET")
  }

  // if (undefined === tweet && (oldTweet = tweet)) {
  //   clearcheck = setInterval(repeatcheck, 500, tweet);
  //   function repeatcheck(tweet) {
  //     // If TWEET is NOT the SAME(TWEET) then print the TWEET
  //     if (tweet !== oldTweet) {
  //       // do something
  //       clearInterval(clearcheck)
  //       console.log("VALUE CHANGE FROM: " +
  //         oldvalue + " to " + value);
  //     } else if (value == oldvalue) {
  //       console.log("VALUE DID NOT CHANGE FROM: " +
  //         oldvalue + " to " + value);
  //     }
  //   }
  // }
}


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
      // const userTimeline = await rwClient.v1.userTimelineByUsername("@ForexLive");
      // const fetchedTweets = userTimeline.tweets;
      let railonTimeline = await rwClient.v1.userTimelineByUsername("@railonacosta");
      const fetchedTweets = railonTimeline.tweets;
      // console.log(fetchedTweets[0].quoted_status_permalink.url)

      checkForNewTweet(fetchedTweets[0].full_text)

      // TelegramBot.sendMessage(plateformObject.chatID, fetchedTweets[0].full_text)
      // TelegramBot.sendMessage(plateformObject.chatID, fetchedTweets[1].full_text)
      // TelegramBot.sendMessage(plateformObject.chatID, fetchedTweets[2].full_text)

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

// const job = new cronJob(" 1 * * * *", () => {
//   console.log("RUNNING")

// })

// job.start()
