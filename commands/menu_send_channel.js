/*CMD
  command: menu_send_channel
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

var msg = "<tg-emoji emoji-id='6154659543570714696'>✉</tg-emoji> <b>" + sc("PLEASE ENTER YOUR UNIQUE POST ID TO DISPATCH:") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html"
});

Bot.run({
  command: "/select_channel"
});
