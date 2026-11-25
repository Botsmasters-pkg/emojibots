/*CMD
  command: check_join
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

if (typeof request !== "undefined" && request && request.id) {
  try {
    Api.answerCallbackQuery({ callback_query_id: request.id });
  } catch (e) {}
}

var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

if (!mustJoin || mustJoin.length === 0) {
  Bot.runCommand("back_to_main");
  return;
}

User.setProperty("fsub_index", 0, "integer");
var firstCh = mustJoin[0];

if (firstCh.type === "request") {
  var cId = String(firstCh.id);
  var cleanCId = cId.replace(/^-100/, "").replace(/^-/, "");
  if (
    Bot.getProperty("cjr_" + cId + "_" + user.telegramid) ||
    Bot.getProperty("cjr_-100" + cleanCId + "_" + user.telegramid) ||
    Bot.getProperty("cjr_" + cleanCId + "_" + user.telegramid) ||
    User.getProperty("cjr_" + cId) ||
    User.getProperty("cjr_" + cleanCId) ||
    User.getProperty("cjr_-100" + cleanCId) ||
    User.getProperty("cjr_self_verified")
  ) {
    Bot.runCommand("/onVerifyJoinCallback", { result: { status: "member" } });
    return;
  }
}

Api.getChatMember({
  chat_id: firstCh.id,
  user_id: user.telegramid,
  on_result: "/onVerifyJoinCallback",
  on_error: "/onVerifyJoinCallback"
});
