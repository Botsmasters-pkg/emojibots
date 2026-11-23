/*CMD
  command: /onSyncBotIdentity
  help: Background handler to auto-detect bot username, title, and ID from token
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

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
}
