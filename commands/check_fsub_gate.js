/*CMD
  command: check_fsub_gate
  help: Real-time dynamic gate checking channel membership before allowing bot usage
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = "8710308658";
var targetCmd = User.getProperty("fsub_target_cmd") || "back_to_main";

// Admin is always exempt
if (String(user.telegramid) === adminId) {
  Bot.runCommand(targetCmd, { gate_passed: true });
  return;
}

var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

// Filter channels that require active membership check (skip request channels)
var channelsToCheck = [];
for (var j = 0; j < mustJoin.length; j++) {
  if (mustJoin[j].type !== "request") {
    channelsToCheck.push(mustJoin[j]);
  }
}

// If no channels to check, let user proceed immediately
if (channelsToCheck.length === 0) {
  Bot.runCommand(targetCmd, { gate_passed: true });
  return;
}

User.setProperty("fsub_gate_list", channelsToCheck, "json");
User.setProperty("fsub_gate_index", 0, "integer");

var firstCh = channelsToCheck[0];
Api.getChatMember({
  chat_id: firstCh.id,
  user_id: user.telegramid,
  on_result: "/onGateCheckMember",
  on_error: "/onGateCheckMember"
});
