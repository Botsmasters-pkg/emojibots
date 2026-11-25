/*CMD
  command: gate_check_step
  help: Live membership verification step for all entry points
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

// If no channels configured, proceed directly to target action
if (!mustJoin || mustJoin.length === 0) {
  var targetNoCh = User.getProperty("gate_target") || "back_to_main";
  User.setProperty("gate_target", null, "string");
  Bot.runCommand(targetNoCh);
  return;
}

var idx = User.getProperty("gate_index") || 0;

// Skip request channels (they auto-pass as join requests)
while (idx < mustJoin.length && mustJoin[idx].type === "request") {
  idx++;
}
User.setProperty("gate_index", idx, "integer");

// If all channels verified
if (idx >= mustJoin.length) {
  User.setProperty("gate_index", 0, "integer");
  User.setProperty("fsub_verified", true, "boolean");
  Bot.setProperty("user_left_" + user.telegramid, false, "boolean");

  var targetDone = User.getProperty("gate_target") || "back_to_main";
  User.setProperty("gate_target", null, "string");
  Bot.runCommand(targetDone);
  return;
}

// Check current channel via Api.getChatMember
var currentCh = mustJoin[idx];
Api.getChatMember({
  chat_id: currentCh.id,
  user_id: user.telegramid,
  on_result: "/onGateCheckCallback",
  on_error: "/onGateCheckCallback"
});
