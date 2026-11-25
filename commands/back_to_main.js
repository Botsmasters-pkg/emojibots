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

var adminId = "8710308658";
var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var hasChannels = rawMustJoin && rawMustJoin.length > 0;
var isVerified = User.getProperty("fsub_verified");
var userLeft = Bot.getProperty("user_left_" + user.telegramid);

if (String(user.telegramid) !== adminId && hasChannels && (!isVerified || userLeft)) {
  Bot.runCommand("show_force_join");
  return;
}

var welcomeText = Libs.emojiHelper.get_welcome_text();
var menuMarkup = Libs.emojiHelper.main_menu(user.telegramid);

Api.sendMessage({
  chat_id: chat.chatid,
  text: welcomeText,
  parse_mode: "html",
  reply_markup: menuMarkup
});
