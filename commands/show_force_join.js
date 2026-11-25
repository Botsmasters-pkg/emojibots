/*CMD
  command: show_force_join
  help: Display force join channels and verify button
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

if (!mustJoin || mustJoin.length === 0) {
  Bot.runCommand("back_to_main");
  return;
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

var userLeft = Bot.getProperty("user_left_" + user.telegramid);
var msgTitle = userLeft ? 
  ("<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>" + sc("ACCESS RESTRICTED! YOU LEFT A REQUIRED CHANNEL:") + "</b>\n━━━━━━━━━━━━━━━━━━━━━━\n\n") :
  ("<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>" + sc("ACCESS DENIED! PLEASE JOIN ALL REQUIRED CHANNELS:") + "</b>\n━━━━━━━━━━━━━━━━━━━━━━\n\n");

var msgNotice = userLeft ?
  ("⚠️ <b>" + sc("Notice:") + "</b> <i>" + sc("Aapne bot ka required channel leave kar diya hai! Bot ke features use karne ke liye kripya channel ko re-join karein, fir VERIFY JOIN par click karein.") + "</i>") :
  ("👉 <i>" + sc("Bot ke features unlock karne ke liye upar diye gaye sabhi channels ko join karein.") + "</i>");

Api.sendMessage({
  chat_id: chat.chatid,
  text: msgTitle + channelListText + "\n" + msgNotice,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: { inline_keyboard: rows }
});
