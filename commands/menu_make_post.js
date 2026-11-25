/*CMD
  command: menu_make_post
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

if (mustJoin && mustJoin.length > 0) {
  var isVerified = Libs.emojiHelper.isUserFsubVerified(user.telegramid, mustJoin);
  if (!isVerified) {
    Bot.runCommand("show_force_join");
    return;
  }
}

var sc = Libs.emojiHelper.sc;

var msg = "<tg-emoji emoji-id='5337310516769467285'>📝</tg-emoji> <b>" + sc("PLEASE SEND YOUR TEXT CONTENT WITH NORMAL Emojis (wo automatic custom emojis me convert ho jayenge):") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html"
});

Bot.run({
  command: "/save_text_content"
});
