/*CMD
  command: add_ch_private
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
var adminId = "8710308658";
if (String(user.telegramid) !== adminId) return;

if (typeof request !== "undefined" && request && request.id) {
  try { Api.answerCallbackQuery({ callback_query_id: request.id }); } catch (e) {}
}

var text = "<tg-emoji emoji-id='5213285132709929474'>🔒</tg-emoji> <b>" + sc("ADD PRIVATE FORCE JOIN CHANNEL") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n" +
  "<b>Step 1/2:</b> " + sc("Please send the Private Channel") + " <b>Chat ID</b>:\n\n" +
  "<b>" + sc("Example:") + "</b> <code>-1001234567890</code>\n\n" +
  "⚠️ <i>" + sc("Note: Channel ID -100 se shuru hona chahiye aur bot Administrator hona zaroori hai.") + "</i>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_navigation_markup()
});

Bot.run({
  command: "/save_private_step1"
});
