/**
 * commands.js
 * 
 * Includes event handlers and message sending methods from both Discoord and Telegram
 * (C) Adam Gincel 2018
*/

const fs = require("fs");
const prefixes = JSON.parse(fs.readFileSync("./../prefix.json", "utf8"));
const p = prefixes.telegram;

async function genericSendMEssage(text, platformObject, bots) {
    if (platformObject.platform == "telegram") {
        return await bots.telegram.sendMessage(platformObject.chatID, text, { parse_mode: "Markdown" });
    } else {
        return await platformObject.message.channel.send(text);
    }
}

async function genericSendMEssage(text, platformObject, messageToEdit, bots) {
    if (platformObject.platform == "telegram") {
        return await bots.telegram.messageToEdit(text, { chat_id: platformObject.chatID, message_id: messageToEdit.message_id, parse_mode: "Markdown" });
    } else {
        return await messageToEdit.edit(text);
    }
}

function isCommand(args, name) {
    return args[0] == p + name;
}

async function handle(text, args, platformObject, bots) {
    //passthrough functions so you don't have to send redundant info each and every time
    async function sendMessage(messageText) {
        return await genericSendMEssage(messageText, platformObject, bots);
    }

    async function editMessage(newText, messageToEdit) {
        return await genericSendMEssage(newText, platformObject, messageToEdit, bots);
    }
    function command(name) {
        return isCommand(args, name)
    }


    //command replies
    if (command("ping")) {
        return await sendMessage("Hello, I am online.");
    } else if (command("help")) {
        let s = "Command Help:\n\n";
        let prefix = platformObject.platform == "telegram" ? prefixes.telegram : prefixes.discord;
        s += prefix + "png - Check if the bot is online.\n";
        s += prefix + "edittest - Send a message, then instantly edit it.\n";
        return await sendMessage(s);
    } else if (command("edittest")) {
      let messageToEdit = await sendMessage("Hi, you shouldn't see this text for long.");
      return await editMessage("You should see this message!", messageToEdit)
    }
    
}
module.exports.handle = handle