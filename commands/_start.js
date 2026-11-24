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

var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

if (mustJoin && mustJoin.length > 0) {
  User.setProperty("fsub_index", 0, "integer");
  var firstCh = mustJoin[0];
  
  // If request channel and already pending request
  if (firstCh.type === "request") {
    var cId = String(firstCh.id);
    var cleanCId = cId.replace(/^-100/, "").replace(/^-/, "");
    if (
      Bot.getProperty("cjr_" + cId + "_" + user.telegramid) ||
      Bot.getProperty("cjr_-100" + cleanCId + "_" + user.telegramid) ||
      Bot.getProperty("cjr_" + cleanCId + "_" + user.telegramid)
    ) {
      Bot.runCommand("/onCheckJoinMember", { result: { status: "member" } });
      return;
    }
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
