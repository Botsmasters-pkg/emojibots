/*CMD
  command: show_force_join
  help: Display force join channels with JOIN buttons (left: primary, right: danger) and verify button
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

for (var j = 0; j < mustJoin.length; j++) {
  var ch = mustJoin[j];
  var col = j % 2; // 0 = left, 1 = right
  var btnStyle = (col === 0) ? "primary" : "danger";
  var iconId = "6154631793787015439";
  if (ch.type === "request") {
    iconId = "6154635564768300782";
  } else if (ch.type === "private") {
    iconId = "5213285132709929474";
  }

  row.push({
    text: sc("JOIN"),
    url: ch.url,
    style: btnStyle,
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

var msgText = "<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>" + sc("ACCESS DENIED! PLEASE JOIN ALL REQUIRED CHANNELS TO UNLOCK FULL BOT FEATURES AND PREMIUM ACCESS.") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msgText,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: { inline_keyboard: rows }
});
