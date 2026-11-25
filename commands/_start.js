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

// Real-time live FSub gate check on /start
User.setProperty("gate_target", "exec_back_to_main", "string");
User.setProperty("gate_index", 0, "integer");
Bot.runCommand("gate_check_step");
