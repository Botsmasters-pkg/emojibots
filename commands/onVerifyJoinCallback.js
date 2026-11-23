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

// For request channels: pending join request counts as APPROVED / VERIFIED!
if (!isMember && currentCh && currentCh.type === "request") {
  var cId = String(currentCh.id);
  var cleanCId = cId.replace(/^-100/, "").replace(/^-/, "");
  if (
    Bot.getProperty("cjr_" + cId + "_" + user.telegramid) ||
    Bot.getProperty("cjr_-100" + cleanCId + "_" + user.telegramid) ||
    Bot.getProperty("cjr_" + cleanCId + "_" + user.telegramid)
  ) {
    isMember = true;
  }
}

if (isMember) {
  var nextIdx = idx + 1;
  if (nextIdx < mustJoin.length) {
    User.setProperty("fsub_index", nextIdx, "integer");
    var nextCh = mustJoin[nextIdx];

    if (nextCh.type === "request") {
      var nId = String(nextCh.id);
      var cleanNId = nId.replace(/^-100/, "").replace(/^-/, "");
      if (
        Bot.getProperty("cjr_" + nId + "_" + user.telegramid) ||
        Bot.getProperty("cjr_-100" + cleanNId + "_" + user.telegramid) ||
        Bot.getProperty("cjr_" + cleanNId + "_" + user.telegramid)
      ) {
        Bot.runCommand("/onVerifyJoinCallback", { result: { status: "member" } });
        return;
      }
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

// Build 2x2 clickable JOIN buttons
var rows = [];
var row = [];

for (var j = 0; j < mustJoin.length; j++) {
  var ch = mustJoin[j];
  var iconId = "6154631793787015439";
  if (ch.type === "request") {
    iconId = "6154635564768300782";
  } else if (ch.type === "private") {
    iconId = "5213285132709929474";
  }

  row.push({
    text: sc("JOIN"),
    url: ch.url,
    style: "primary",
    icon_custom_emoji_id: iconId
  });

  if (row.length === 2) {
    rows.push(row);
    row = [];
  }
}

if (row.length > 0) {
  rows.push(row);
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
