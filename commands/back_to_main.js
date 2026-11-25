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
var isGateChecked = (typeof options !== "undefined" && options && options.gate_passed);

if (String(user.telegramid) !== adminId && !isGateChecked) {
  User.setProperty("fsub_target_cmd", "back_to_main", "string");
  Bot.runCommand("check_fsub_gate");
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
