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
  sc("Please send the Private Channel details in format:") + "\n" +
  "<code>Chat ID | Invite Link | Channel Title</code>\n\n" +
  "<b>" + sc("Example:") + "</b>\n" +
  "<code>-1001234567890 | https://t.me/+AbCdEfGh | VIP Channel</code>\n\n" +
  "<i>" + sc("Or without title:") + "</i>\n" +
  "<code>-1001234567890 | https://t.me/+AbCdEfGh</code>\n\n" +
  "⚠️ <b>" + sc("Important Notes:") + "</b>\n" +
  "1. " + sc("Bot MUST be an Administrator in the private channel.") + "\n" +
  "2. " + sc("Chat ID usually starts with -100 (e.g. -100xxxxxxxxxx).");

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_navigation_markup()
});

Bot.run({
  command: "/save_private_channel"
});
