/*CMD
  command: add_ch_public
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

var text = "<tg-emoji emoji-id='6154631793787015439'>🌐</tg-emoji> <b>" + sc("ADD PUBLIC FORCE JOIN CHANNEL") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n" +
  sc("Please send the Public Channel Username or Link:") + "\n\n" +
  "<b>" + sc("Examples:") + "</b>\n" +
  "• <code>@MyChannel</code>\n" +
  "• <code>https://t.me/MyChannel</code>\n\n" +
  "⚠️ <i>" + sc("Note: Bot must be added as Administrator in this channel!") + "</i>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_navigation_markup()
});

Bot.run({
  command: "/save_public_channel"
});
