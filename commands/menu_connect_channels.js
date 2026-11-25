/*CMD
  command: menu_connect_channels
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
var botUser = Libs.emojiHelper.get_bot_username();

var msg = "<tg-emoji emoji-id='5429651785352501917'>↗️</tg-emoji> <b>" + sc("PLEASE FORWARD A MESSAGE FROM YOUR CHANNEL OR SEND @username:") + "</b>\n\n" +
  "<i>• " + sc("Bot") + " (<code>" + botUser + "</code>) " + sc("ko channel me admin banayein") + "\n" +
  "• " + sc("Aap khud bhi us channel ke Admin/Owner hone chahiye") + "</i>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html"
});

Bot.run({
  command: "/verify_channel"
});
