/*CMD
  command: /onGateCheckCallback
  help: Real-time verification callback for gate check
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var sc = Libs.emojiHelper.sc;
var member = (typeof options !== "undefined" && options && options.result) ? options.result : null;
var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

var idx = User.getProperty("gate_index") || 0;
var currentCh = (idx < mustJoin.length) ? mustJoin[idx] : null;

var isMember = false;
if (member) {
  var st = member.status;
  if (st === "member" || st === "administrator" || st === "creator") {
    isMember = true;
  }
}

// Request channels count as passed
if (currentCh && currentCh.type === "request") {
  isMember = true;
}

// If user is NOT a member of this channel (or has left!)
if (!isMember) {
  User.setProperty("gate_index", 0, "integer");
  User.setProperty("gate_target", null, "string");
  User.setProperty("fsub_verified", false, "boolean");
  Bot.setProperty("user_left_" + user.telegramid, true, "boolean");
  Bot.setProperty("fsub_verified_" + user.telegramid, false, "boolean");

  if (typeof request !== "undefined" && request && request.id) {
    try {
      Api.answerCallbackQuery({
        callback_query_id: request.id,
        text: sc("PLEASE JOIN ALL CHANNELS TO CONTINUE!"),
        show_alert: true
      });
    } catch (e) {}
  }

  Bot.runCommand("show_force_join");
  return;
}

// User is member of current channel, advance to next channel
var nextIdx = idx + 1;
while (nextIdx < mustJoin.length && mustJoin[nextIdx].type === "request") {
  nextIdx++;
}
User.setProperty("gate_index", nextIdx, "integer");

if (nextIdx < mustJoin.length) {
  // Check channel 1 directly with zero queue delay for instant sub-second response
  if (nextIdx === 1) {
    var nextCh = mustJoin[nextIdx];
    Api.getChatMember({
      chat_id: nextCh.id,
      user_id: user.telegramid,
      on_result: "/onGateCheckCallback",
      on_error: "/onGateCheckCallback"
    });
    return;
  }

  // If 3+ channels, use decoupled runner to keep stack depth safe
  Bot.run({
    command: "gate_check_step",
    run_after: 0.1
  });
  return;
}

// All channels passed!
User.setProperty("gate_index", 0, "integer");
User.setProperty("fsub_verified", true, "boolean");
Bot.setProperty("user_left_" + user.telegramid, false, "boolean");

var targetPassed = User.getProperty("gate_target") || "exec_back_to_main";
User.setProperty("gate_target", null, "string");
Bot.runCommand(targetPassed);
