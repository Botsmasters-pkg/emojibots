/*CMD
  command: admin_remove_channel
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

var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

var listStr = "";
for (var j = 0; j < mustJoin.length; j++) {
  var ch = mustJoin[j];
  var typeBadge = (ch.type === "request") ? "📩 Request" : (ch.type === "private" ? "🔒 Private" : "🌐 Public");
  listStr += "<b>" + (j + 1) + ".</b> " + ch.title + " (<code>" + ch.id + "</code>) [" + typeBadge + "]\n";
}

if (!listStr) listStr = "<i>" + sc("No channels currently configured.") + "</i>\n";

var msg = "<tg-emoji emoji-id='5870869476408299692'>➖</tg-emoji> <b>" + sc("REMOVE MANDATORY JOIN CHANNEL") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n" +
  listStr + "\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n" +
  sc("Channel hatane ke liye uska number (1, 2, ...), Chat ID, ya @username send karein:");

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_navigation_markup()
});

Bot.run({
  command: "/delete_channel"
});
