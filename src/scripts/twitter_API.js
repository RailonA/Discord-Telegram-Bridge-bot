
// This will ONLY work with TypeScript on module: "commonjs"
// import TwitterApi from 'twitter-api-v2';

// This will work on TypeScript (with commonJS and ECMA)
// AND with Node.js in ECMA mode (.mjs files, type: "module" in package.json)
// import { TwitterApi } from 'twitter-api-v2';

// This will work with Node.js on CommonJS mode (TypeScript or not)
const { TwitterApi } = require('twitter-api-v2')

const fs = require("fs");
const tokens = JSON.parse(fs.readFileSync("./tokens/twitter_token.json", "utf8"));
    
const client = new TwitterApi({
  appKey: tokens.CONSUMER_KEY,
  appSecret: tokens.CONSUMER_SECRET,
  accessToken: tokens.ACCESS_TOKEN_KEY,
  accessSecret: tokens.ACCESS_TOKEN_SECRET,
});

const rwClient = client.readWrite

module.exports = rwClient
