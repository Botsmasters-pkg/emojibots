/*CMD
  command: /onGateCheckMember
  help: Callback for dynamic membership check gate
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var sc = Libs.emojiHelper.sc;
var targetCmd = User.getProperty("fsub_target_cmd") || "back_to_main";
var channelsToCheck = User.getProperty("fsub_gate_list") || [];
var idx = User.getProperty("fsub_gate_index") || 0;
var currentCh = (idx < channelsToCheck.length) ? channelsToCheck[idx] : null;

var member = (typeof options !== "undefined" && options && options.result) ? options.result : null;
var isMember = false;
if (member) {
  var st = member.status;
  if (st === "member" || st === "administrator" || st === "creator") {
    isMember = true;
  }
}

// If current channel is active member, check next channel
if (isMember) {
  var nextIdx = idx + 1;
  if (nextIdx < channelsToCheck.length) {
    User.setProperty("fsub_gate_index", nextIdx, "integer");
    var nextCh = channelsToCheck[nextIdx];
    Api.getChatMember({
      chat_id: nextCh.id,
      user_id: user.telegramid,
      on_result: "/onGateCheckMember",
      on_error: "/onGateCheckMember"
    });
    return;
  }

  // All channels checked and user is active member!
  User.setProperty("fsub_gate_index", 0, "integer");
  User.setProperty("fsub_verified", true, "boolean");
  Bot.setProperty("user_left_" + user.telegramid, false, "boolean");
  Bot.runCommand(targetCmd, { gate_passed: true });
  return;
}

// USER LEFT THE CHANNEL OR IS NOT A MEMBER!
// Block access and require re-joining
User.setProperty("fsub_verified", false, "boolean");
Bot.setProperty("user_left_" + user.telegramid, true, "boolean");

if (typeof request !== "undefined" && request && request.id) {
  try {
    var missingName = currentCh ? (currentCh.title || currentCh.id) : "";
    var alertText = missingName ? (sc("YOU LEFT ") + missingName + sc("! PLEASE RE-JOIN.")) : sc("YOU LEFT THE CHANNEL! PLEASE RE-JOIN TO USE BOT.");
    Api.answerCallbackQuery({
      callback_query_id: request.id,
      text: alertText,
      show_alert: true
    });
  } catch (e) {}
}

var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var k = 0; k < rawMustJoin.length; k++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[k]);
  if (norm) mustJoin.push(norm);
}

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

rows.push([
  { text: sc("✔ VERIFY JOIN"), callback_data: "check_join", style: "success", icon_custom_emoji_id: "6154718341672997377" }
]);

var blockMsg = "<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>" + sc("ACCESS RESTRICTED! YOU LEFT A REQUIRED CHANNEL:") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
  channelListText + "\n" +
  "⚠️ <b>" + sc("Notice:") + "</b> <i>" + sc("Aapne bot ka required channel leave kar diya hai! Bot ke features use karne ke liye kripya channel ko re-join karein, fir VERIFY JOIN par click karein.") + "</i>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: blockMsg,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: { inline_keyboard: rows }
});
