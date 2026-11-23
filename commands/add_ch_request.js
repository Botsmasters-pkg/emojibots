/*CMD
  command: add_ch_request
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
  try { Api.answerCallbackQuery({ callback_query_id: request.id }); } catch (e) { }
}

var text = "<tg-emoji emoji-id='6154635564768300782'>📩</tg-emoji> <b>" + sc("ADD PRIVATE REQUEST CHANNEL (JOIN REQUEST)") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n" +
  "<b>Step 1/2:</b> " + sc("Please send the Request Channel") + " <b>Chat ID</b>:\n\n" +
  "<b>" + sc("Example:") + "</b> <code>-1009876543210</code>\n\n" +
  "⚠️ <b>" + sc("Crucial Requirements:") + "</b>\n" +
  "1. " + sc("Channel me 'Approve New Members' (Join Request) on hona chahiye.") + "\n" +
  "2. " + sc("Bot MUST be an Administrator in the channel.") + "\n" +
  "3. " + sc("User ki request pending rahegi to bhi use verified mana jayega!");

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_navigation_markup()
});

Bot.run({
  command: "/save_request_step1"
});
