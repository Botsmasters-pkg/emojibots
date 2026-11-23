/*CMD
  command: /onSyncBotIdentityDone
  help: Callback handler for manual sync of bot identity
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

var bInfo = (typeof options !== "undefined" && options && options.result) ? options.result : (typeof options !== "undefined" && options && options.id ? options : null);

if (bInfo && bInfo.username) {
  var bUser = "@" + bInfo.username.replace(/^@/, "");
  var bTitle = bInfo.first_name || bInfo.username || "Bot";
  var bId = bInfo.id ? String(bInfo.id) : null;

  Bot.setProperty("bot_username", bUser, "string");
  Bot.setProperty("bot_title", bTitle, "string");
  if (bId) {
    Bot.setProperty("bot_telegram_id", bId, "string");
  }

  var successMsg = "<tg-emoji emoji-id='5375338737028841420'>✅</tg-emoji> <b>" + sc("BOT IDENTITY SUCCESSFULLY SYNCED FROM TOKEN!") + "</b>\n" +
    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
    "🤖 <b>" + sc("Bot Username:") + "</b> <code>" + bUser + "</code>\n" +
    "🏷 <b>" + sc("Bot Title:") + "</b> <b>" + bTitle + "</b>\n" +
    "🆔 <b>" + sc("Telegram Bot ID:") + "</b> <code>" + (bId || "Unknown") + "</code>\n" +
    "⚙️ <b>" + sc("BB Bot Instance:") + "</b> <code>" + (typeof bot !== "undefined" && bot && bot.name ? bot.name : "BB") + "</code>\n\n" +
    "━━━━━━━━━━━━━━━━━━━━━━\n" +
    "<i>" + sc("Yeh cloned bot ab fully apne Telegram token ke username par operate kar raha hai!") + "</i>";

  Api.sendMessage({
    chat_id: chat.chatid,
    text: successMsg,
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_navigation_markup()
  });
} else {
  var errMsg = "<tg-emoji emoji-id='5416117059207572332'>❌</tg-emoji> <b>" + sc("SYNC FAILED!") + "</b>\n\n" +
    sc("Telegram Bot API getMe call fail ho gayi. Kripya ensure karein ki Bots.Business App Settings me valid Bot Token daala gaya hai.") + "\n\n" +
    "<code>" + JSON.stringify(options || {}) + "</code>";

  Api.sendMessage({
    chat_id: chat.chatid,
    text: errMsg,
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_navigation_markup()
  });
}
