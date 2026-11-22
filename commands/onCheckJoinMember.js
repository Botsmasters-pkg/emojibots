/*CMD
  command: /onCheckJoinMember
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
      on_result: "/onCheckJoinMember",
      on_error: "back_to_main"
    });
    return;
  }
  
  User.setProperty("fsub_index", 0, "integer");
  Bot.runCommand("back_to_main");
  return;
}

var rows = [];
for (var i = 0; i < mustJoin.length; i++) {
  var ch = mustJoin[i];
  var url = ch.indexOf("http") === 0 ? ch : ("https://t.me/" + ch.replace("@", ""));
  rows.push([
    { text: "JOIN " + ch, url: url, style: "primary", icon_custom_emoji_id: "6154631793787015439" }
  ]);
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