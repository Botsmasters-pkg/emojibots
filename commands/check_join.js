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
  } catch (e) { }
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

// Request channels automatically count as verified (no waiting for admin approval)
if (firstCh.type === "request") {
  Bot.runCommand("/onVerifyJoinCallback", { result: { status: "member" } });
  return;
}

Api.getChatMember({
  chat_id: firstCh.id,
  user_id: user.telegramid,
  on_result: "/onVerifyJoinCallback",
  on_error: "/onVerifyJoinCallback"
});
