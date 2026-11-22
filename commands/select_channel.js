/*CMD
  command: /select_channel
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var sc = Libs.emojiHelper.sc;

if (!message) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>" + sc("❌ PLEASE SEND A VALID POST ID.") + "</b>",
    parse_mode: "html"
  });
  return;
}

var postId = message.trim().toUpperCase();
var postsDb = Bot.getProperty("posts_db") || {};

if (!postsDb[postId]) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>" + sc("❌ INVALID POST ID. Pehle MAKE POST se post banayein.") + "</b>",
    parse_mode: "html"
  });
  return;
}

var userChannels = Bot.getProperty("user_channels") || {};
var ulist = userChannels[user.telegramid] || [];

if (ulist.length === 0) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>" + sc("❌ NO CHANNEL CONNECTED YET. Pehle CONNECT CHANNELS se channel connect karein.") + "</b>",
    parse_mode: "html"
  });
  return;
}

User.setProperty("sending_post_id", postId, "string");
User.setProperty("channel_check_idx", 0, "integer");
User.setProperty("valid_channels_list", [], "json");

Api.getChatMember({
  chat_id: ulist[0].id,
  user_id: user.telegramid,
  on_result: "/onVerifySelectChannel",
  on_error: "/onVerifySelectChannel"
});