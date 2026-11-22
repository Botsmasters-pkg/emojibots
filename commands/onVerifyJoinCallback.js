/*CMD
  command: /onVerifyJoinCallback
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
var member = (typeof options !== "undefined" && options && options.result) ? options.result : null;
var mustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var idx = User.getProperty("fsub_index") || 0;
var isMember = false;

if (member) {
  var st = member.status;
  if (st === "member" || st === "administrator" || st === "creator") {
    isMember = true;
  }
}

if (isMember) {
  var nextIdx = idx + 1;
  if (nextIdx < mustJoin.length) {
    User.setProperty("fsub_index", nextIdx, "integer");
    Api.getChatMember({
      chat_id: mustJoin[nextIdx],
      user_id: user.telegramid,
      on_result: "/onVerifyJoinCallback",
      on_error: "back_to_main"
    });
    return;
  }
  
  User.setProperty("fsub_index", 0, "integer");
  var successMsg = "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("VERIFICATION SUCCESSFUL! ALL CHANNELS JOINED SUCCESSFULLY. PLEASE USE THE MENU BELOW.") + "</b>";
  Api.sendMessage({
    chat_id: chat.chatid,
    text: successMsg,
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.main_menu(user.telegramid)
  });
  return;
}

Api.answerCallbackQuery({
  callback_query_id: request.id,
  text: sc("HAVEN'T JOINED YET! PLEASE JOIN ALL CHANNELS."),
  show_alert: true
});