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

// Auto-detect bot identity from token if not yet synced or periodically
if (!Bot.getProperty("bot_username") || !Bot.getProperty("bot_telegram_id")) {
  Api.getMe({
    on_result: "/onSyncBotIdentity",
    on_error: "/onSyncBotIdentity"
  });
}

// Ensure webhook allows my_chat_member updates for auto-detecting admin channels
Api.getWebhookInfo({
  on_result: "/onEnsureWebhookAllowedUpdates",
  on_error: "/onEnsureWebhookAllowedUpdates"
});

var users = Bot.getProperty("users") || [];
if (users.indexOf(user.telegramid) === -1) {
  users.push(user.telegramid);
  Bot.setProperty("users", users, "json");
}

// Clean up old hardcoded channels from database if present
if (!Bot.getProperty("cleaned_hardcoded_defaults_v3")) {
  var storedMJoin = Bot.getProperty("must_join");
  if (Array.isArray(storedMJoin)) {
    var cleaned = [];
    for (var k = 0; k < storedMJoin.length; k++) {
      var item = storedMJoin[k];
      var idStr = (typeof item === "string") ? item : (item && item.id ? String(item.id) : "");
      if (idStr.toLowerCase() !== "@botadminshere" && idStr.toLowerCase() !== "@toxic_adminn") {
        cleaned.push(item);
      }
    }
    Bot.setProperty("must_join", cleaned, "json");
  }
  Bot.setProperty("cleaned_hardcoded_defaults_v3", true, "boolean");
}

var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

if (mustJoin && mustJoin.length > 0) {
  User.setProperty("fsub_index", 0, "integer");
  var firstCh = mustJoin[0];
  
  // If request channel, automatically verified without waiting for admin approval
  if (firstCh.type === "request") {
    Bot.runCommand("/onCheckJoinMember", { result: { status: "member" } });
    return;
  }

  Api.getChatMember({
    chat_id: firstCh.id,
    user_id: user.telegramid,
    on_result: "/onCheckJoinMember",
    on_error: "/onCheckJoinMember"
  });
  return;
}

Bot.runCommand("back_to_main");
