/*CMD
  command: admin_list_channels
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var helper = (typeof Libs !== "undefined" && Libs) ? (Libs.emojiHelper || Libs.EmojiHelper) : null;
var sc = (helper && helper.sc) ? helper.sc : function(s) { return s || ""; };
var adminId = "8710308658";
if (String(user.telegramid) !== adminId) return;

if (typeof request !== "undefined" && request && request.id) {
  try { Api.answerCallbackQuery({ callback_query_id: request.id }); } catch (e) {}
}

var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

var chListStr = "";
for (var j = 0; j < mustJoin.length; j++) {
  var ch = mustJoin[j];
  var typeBadge = (ch.type === "request") ? "📩 Join Request" : (ch.type === "private" ? "🔒 Private" : "🌐 Public");
  chListStr += (j + 1) + ". <b>" + ch.title + "</b> [" + typeBadge + "]\n" +
               "   • ID: <code>" + ch.id + "</code>\n" +
               "   • Link: " + (ch.url ? ch.url : "N/A") + "\n\n";
}

if (!chListStr) chListStr = "<i>" + sc("No channels configured.") + "</i>\n";

var text = "<tg-emoji emoji-id='6154659543570714696'>📋</tg-emoji> <b>" + sc("CURRENT MANDATORY JOIN CHANNELS:") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n" +
  chListStr +
  "━━━━━━━━━━━━━━━━━━━━━━\n" +
  "<b>Total Channels:</b> " + mustJoin.length;

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: Libs.emojiHelper.admin_navigation_markup()
});
