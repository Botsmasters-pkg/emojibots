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

// For request channels: check if join request recorded
if (!isMember && currentCh && currentCh.type === "request") {
  if (Bot.getProperty("cjr_" + currentCh.id + "_" + user.telegramid)) {
    isMember = true;
  }
}

if (isMember) {
  var nextIdx = idx + 1;
  if (nextIdx < mustJoin.length) {
    User.setProperty("fsub_index", nextIdx, "integer");
    var nextCh = mustJoin[nextIdx];

    if (nextCh.type === "request" && Bot.getProperty("cjr_" + nextCh.id + "_" + user.telegramid)) {
      Bot.runCommand("/onVerifyJoinCallback", { result: { status: "member" } });
      return;
    }

    Api.getChatMember({
      chat_id: nextCh.id,
      user_id: user.telegramid,
      on_result: "/onVerifyJoinCallback",
      on_error: "/onVerifyJoinCallback"
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

if (typeof request !== "undefined" && request && request.id) {
  try {
    Api.answerCallbackQuery({
      callback_query_id: request.id,
      text: sc("HAVEN'T JOINED YET! PLEASE JOIN ALL CHANNELS."),
      show_alert: true
    });
  } catch (e) {}
}

var rows = [];
for (var j = 0; j < mustJoin.length; j++) {
  var ch = mustJoin[j];
  var label = "JOIN " + ch.title;
  var iconId = "6154631793787015439";
  if (ch.type === "request") {
    label = "REQUEST " + ch.title;
    iconId = "6154635564768300782";
  } else if (ch.type === "private") {
    label = "JOIN " + ch.title;
    iconId = "5213285132709929474";
  }
  rows.push([
    { text: label, url: ch.url, style: "primary", icon_custom_emoji_id: iconId }
  ]);
}
rows.push([
  { text: sc("VERIFY JOIN"), callback_data: "check_join", style: "success", icon_custom_emoji_id: "6154718341672997377" }
]);

var notJoinedMsg = "<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>" + sc("ACCESS DENIED! PLEASE JOIN ALL REQUIRED CHANNELS TO UNLOCK FULL BOT FEATURES AND PREMIUM ACCESS.") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: notJoinedMsg,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: { inline_keyboard: rows }
});
