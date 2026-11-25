/*CMD
  command: /start
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
Bot.setProperty("admin_id", adminId, "string");

// Auto-detect bot identity from token if not yet synced
if (!Bot.getProperty("bot_username") || !Bot.getProperty("bot_telegram_id")) {
  Api.getMe({
    on_result: "/onSyncBotIdentity",
    on_error: "/onSyncBotIdentity"
  });
}

// Thread-safe and scalable user tracking
if (!User.getProperty("bot_user_registered")) {
  User.setProperty("bot_user_registered", true, "boolean");
  var curCount = Bot.getProperty("total_users_count") || 0;
  Bot.setProperty("total_users_count", curCount + 1, "integer");
}

var users = Bot.getProperty("users") || [];
if (users.length < 25000 && users.indexOf(user.telegramid) === -1) {
  users.push(user.telegramid);
  Bot.setProperty("users", users, "json");
}

var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

// If channels are configured: check FSub for all users (including admin so admin can test!)
if (mustJoin && mustJoin.length > 0) {
  var isVerified = Libs.emojiHelper.isUserFsubVerified(user.telegramid, mustJoin);
  if (!isVerified) {
    Bot.runCommand("show_force_join");
    return;
  }
}

Bot.runCommand("back_to_main");
