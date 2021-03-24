const TelegramBot = require('node-telegram-bot-api');
const Telegraf = require('telegraf');

// replace the value below with the Telegram token you receive from @BotFather
const token = //insert token here

// Create a bot that uses 'polling' to fetch new updates
const bot_tb = new TelegramBot(token, {polling: true});
const bot_tf = new Telegraf(token);

bot_tb.on('location', (msg) => {
    console.log(msg.location.latitude);
    console.log(msg.location.longitude);
  });
