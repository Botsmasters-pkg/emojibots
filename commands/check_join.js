/*CMD
  command: check_join
  help: Entry point to verify join for all channels
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
  User.setProperty("fsub_verified", true, "boolean");
  Bot.setProperty("user_left_" + user.telegramid, false, "boolean");
  Bot.runCommand("back_to_main");
  return;
}

User.setProperty("fsub_index", 0, "integer");
Bot.runCommand("verify_next_channel");
