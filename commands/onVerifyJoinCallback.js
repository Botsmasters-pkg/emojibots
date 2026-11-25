/*CMD
  command: /onVerifyJoinCallback
  help: Single channel verification callback with clean decoupled scheduling
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var helper = (typeof Libs !== "undefined" && Libs) ? (Libs.emojiHelper || Libs.EmojiHelper) : null;
var sc = (helper && helper.sc) ? helper.sc : function(s) { return s || ""; };
var member = (typeof options !== "undefined" && options && options.result) ? options.result : null;
var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

var idx = User.getProperty("fsub_index") || 0;
var currentCh = (idx < mustJoin.length) ? mustJoin[idx] : null;

var isMember = false;
if (member) {
  var st = member.status;
  if (st === "member" || st === "administrator" || st === "creator") {
    isMember = true;
  }
}

// Request channels automatically count as approved
if (currentCh && currentCh.type === "request") {
  isMember = true;
}

// If user is a member of this channel, advance to next channel
if (isMember) {
  var nextIdx = idx + 1;
  while (nextIdx < mustJoin.length && mustJoin[nextIdx].type === "request") {
    nextIdx++;
  }
  User.setProperty("fsub_index", nextIdx, "integer");

  if (nextIdx < mustJoin.length) {
    // Check channel 1 directly with zero queue delay for instant response
    if (nextIdx === 1) {
      var nextCh = mustJoin[nextIdx];
      Api.getChatMember({
        chat_id: nextCh.id,
        user_id: user.telegramid,
        on_result: "/onVerifyJoinCallback",
        on_error: "/onVerifyJoinCallback"
      });
      return;
    }

    Bot.run({
      command: "verify_next_channel",
      run_after: 0.1
    });
    return;
  }

  // All channels verified!
  var currentFp = Libs.emojiHelper.getChannelsFingerprint(mustJoin);
  User.setProperty("fsub_index", 0, "integer");
  User.setProperty("fsub_verified", true, "boolean");
  User.setProperty("fsub_verified_fp", currentFp, "string");
  Bot.setProperty("fsub_verified_" + user.telegramid, true, "boolean");
  Bot.setProperty("fsub_verified_fp_" + user.telegramid, currentFp, "string");
  Bot.setProperty("user_left_" + user.telegramid, false, "boolean");

  var successMsg = "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("VERIFICATION SUCCESSFUL! ALL CHANNELS JOINED SUCCESSFULLY. PLEASE USE THE MENU BELOW.") + "</b>";
  Api.sendMessage({
    chat_id: chat.chatid,
    text: successMsg,
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.main_menu(user.telegramid)
  });
  return;
}

// User is NOT a member of this channel!
// Stop checking, show alert and channel buttons
if (typeof request !== "undefined" && request && request.id) {
  try {
    Api.answerCallbackQuery({
      callback_query_id: request.id,
      text: sc("HAVEN'T JOINED YET! PLEASE JOIN ALL CHANNELS."),
      show_alert: true
    });
  } catch (e) {}
}

Bot.runCommand("show_force_join");
