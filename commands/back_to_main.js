/*CMD
  command: back_to_main
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var sc = Libs.emojiHelper.sc;
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

var welcomeText = Libs.emojiHelper.get_welcome_text();
var menuMarkup = Libs.emojiHelper.main_menu(user.telegramid);

Api.sendMessage({
  chat_id: chat.chatid,
  text: welcomeText,
  parse_mode: "html",
  reply_markup: menuMarkup
});
