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

// Request channels automatically count as APPROVED / VERIFIED without waiting for admin approval!
if (currentCh && currentCh.type === "request") {
  isMember = true;
}

if (isMember) {
  var nextIdx = idx + 1;
  if (nextIdx < mustJoin.length) {
    User.setProperty("fsub_index", nextIdx, "integer");
    var nextCh = mustJoin[nextIdx];

    // Request channels automatically count as verified
    if (nextCh.type === "request") {
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
    var missingName = currentCh ? (currentCh.title || currentCh.id) : "";
    var alertText = missingName ? (sc("PLEASE JOIN: ") + missingName) : sc("HAVEN'T JOINED YET! PLEASE JOIN ALL CHANNELS.");
    Api.answerCallbackQuery({
      callback_query_id: request.id,
      text: alertText,
      show_alert: true
    });
  } catch (e) {}
}

// User is not a member of all required channels.
// Build channel list and buttons showing exact channel titles
var rows = [];
var row = [];
var channelListText = "";

for (var j = 0; j < mustJoin.length; j++) {
  var ch = mustJoin[j];
  var chTitle = ch.title || ch.id;
  var iconId = "6154631793787015439";
  var btnText = "📢 " + chTitle;

  if (ch.type === "request") {
    iconId = "6154635564768300782";
    btnText = "📩 " + chTitle;
    channelListText += (j + 1) + ". 📩 <b>" + chTitle + "</b> <i>(" + sc("Request Channel") + ")</i>\n";
  } else if (ch.type === "private") {
    iconId = "5213285132709929474";
    btnText = "🔒 " + chTitle;
    channelListText += (j + 1) + ". 🔒 <b>" + chTitle + "</b> <i>(" + sc("Private Channel") + ")</i>\n";
  } else {
    channelListText += (j + 1) + ". 📢 <b>" + chTitle + "</b>\n";
  }

  if (btnText.length > 20) {
    if (row.length > 0) {
      rows.push(row);
      row = [];
    }
    rows.push([{
      text: btnText,
      url: ch.url,
      style: "primary",
      icon_custom_emoji_id: iconId
    }]);
  } else {
    row.push({
      text: btnText,
      url: ch.url,
      style: "primary",
      icon_custom_emoji_id: iconId
    });
    if (row.length === 2) {
      rows.push(row);
      row = [];
    }
  }
}

if (row.length > 0) {
  rows.push(row);
}

// Bottom Verify Join button
rows.push([
  { text: sc("✔ VERIFY JOIN"), callback_data: "check_join", style: "success", icon_custom_emoji_id: "6154718341672997377" }
]);

var notJoinedMsg = "<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>" + sc("ACCESS DENIED! PLEASE JOIN ALL REQUIRED CHANNELS:") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
  channelListText + "\n" +
  "👉 <i>" + sc("Bot ke features unlock karne ke liye upar diye gaye sabhi channels ko join karein.") + "</i>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: notJoinedMsg,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: { inline_keyboard: rows }
});
