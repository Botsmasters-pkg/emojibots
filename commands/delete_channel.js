/*CMD
  command: /delete_channel
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
var adminId = "8710308658";
if (String(user.telegramid) !== adminId) return;

if (!message) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Please send a valid channel username.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

var ch = message.trim();
var mustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;

var idx = mustJoin.indexOf(ch);
if (idx !== -1) {
  mustJoin.splice(idx, 1);
  Bot.setProperty("must_join", mustJoin, "json");
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("Channel removed successfully from mandatory join list!") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
} else {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Channel not found in list.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
}