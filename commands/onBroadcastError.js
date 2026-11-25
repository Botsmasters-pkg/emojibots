/*CMD
  command: /onBroadcastError
  help: Silently handle broadcast delivery errors (such as bot blocked by user)
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var err = (typeof options !== "undefined" && options && options.error) ? options.error : null;
var targetId = (typeof options !== "undefined" && options && options.target_user_id) ? options.target_user_id : null;

// If user blocked the bot (403 Forbidden) or account deleted, clean them from active broadcast users
if (err && (err.error_code === 403 || (err.description && err.description.indexOf("blocked by the user") !== -1))) {
  if (targetId) {
    var users = Bot.getProperty("users") || [];
    var idx = users.indexOf(targetId);
    if (idx !== -1) {
      users.splice(idx, 1);
      Bot.setProperty("users", users, "json");
    }
  }
}
