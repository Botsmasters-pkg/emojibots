/*CMD
  command: /save_private_step2
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var helper = (typeof Libs !== "undefined" && Libs) ? (Libs.emojiHelper || Libs.EmojiHelper) : null;
var sc = (helper && helper.sc) ? helper.sc : function(s) { return s || ""; };
var adminId = "8710308658";
if (String(user.telegramid) !== adminId) return;

var chatId = User.getProperty("temp_private_chat_id");
if (!chatId) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Session expired! Please start again from Admin Panel.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

if (!message) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Please send a valid invite link.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

var inviteLink = message.trim();
if (inviteLink.indexOf("http") !== 0 && inviteLink.indexOf("t.me") !== 0) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Invalid Invite Link! Must be a valid link starting with https://t.me/...") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

if (inviteLink.indexOf("http") !== 0) {
  inviteLink = "https://" + inviteLink;
}

User.setProperty("temp_private_chat_id", null, "string");

var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

for (var j = 0; j < mustJoin.length; j++) {
  if (String(mustJoin[j].id) === chatId) {
    Api.sendMessage({
      chat_id: chat.chatid,
      text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("This channel is already in the list!") + "</b>",
      parse_mode: "html",
      reply_markup: Libs.emojiHelper.admin_keyboard()
    });
    return;
  }
}

var title = "Private Channel (" + chatId.slice(-4) + ")";
mustJoin.push({
  id: chatId,
  title: title,
  url: inviteLink,
  type: "private"
});

Bot.setProperty("must_join", mustJoin, "json");

var successMsg = "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("PRIVATE CHANNEL ADDED SUCCESSFULLY!") + "</b>\n\n" +
  "🆔 <b>" + sc("Chat ID:") + "</b> <code>" + chatId + "</code>\n" +
  "🔗 <b>" + sc("Invite Link:") + "</b> " + inviteLink + "\n" +
  "🔒 <b>" + sc("Type:") + "</b> " + sc("Private Channel");

Api.sendMessage({
  chat_id: chat.chatid,
  text: successMsg,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: Libs.emojiHelper.admin_keyboard()
});
