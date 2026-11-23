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
  
  // If request channel and already requested
  if (firstCh.type === "request" && Bot.getProperty("cjr_" + firstCh.id + "_" + user.telegramid)) {
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
