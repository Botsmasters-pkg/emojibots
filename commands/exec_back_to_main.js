/*CMD
  command: exec_back_to_main
  help: Action to render Main Menu once verified
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

if (typeof request !== "undefined" && request && request.id) {
  try { Api.answerCallbackQuery({ callback_query_id: request.id }); } catch (e) {}
}

var welcomeText = Libs.emojiHelper.get_welcome_text();
var menuMarkup = Libs.emojiHelper.main_menu(user.telegramid);

Api.sendMessage({
  chat_id: chat.chatid,
  text: welcomeText,
  parse_mode: "html",
  reply_markup: menuMarkup
});
