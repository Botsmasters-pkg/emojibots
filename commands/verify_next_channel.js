/*CMD
  command: verify_next_channel
  help: Step-by-step verification worker with fresh execution context (handles unlimited channels)
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var sc = Libs.emojiHelper.sc;
var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

var idx = User.getProperty("fsub_index") || 0;

// Automatically skip past any request channels (they auto-pass)
while (idx < mustJoin.length && mustJoin[idx].type === "request") {
  idx++;
}
User.setProperty("fsub_index", idx, "integer");

// If all channels verified
if (idx >= mustJoin.length) {
  User.setProperty("fsub_index", 0, "integer");
  User.setProperty("fsub_verified", true, "boolean");
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

// Check current channel via Api.getChatMember
var currentCh = mustJoin[idx];
Api.getChatMember({
  chat_id: currentCh.id,
  user_id: user.telegramid,
  on_result: "/onVerifyJoinCallback",
  on_error: "/onVerifyJoinCallback"
});
