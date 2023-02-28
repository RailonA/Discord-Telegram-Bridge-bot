const handler = (message) => {
    console.log(message);
    bot.sendMessage(message.chat.id, "Message Recieved");
}
module.exports = handler;