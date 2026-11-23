/*CMD
  command: /save_request_channel
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var sc = Libs.emojiHelper.sc;
var adminId = "8710308658";
if (String(user.telegramid) !== adminId) return;

if (!message) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Please provide channel details in valid format.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

var parts = message.split("|");
if (parts.length < 2) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Invalid format!") + "</b>\n\n" +
      sc("Please send in format:") + "\n<code>Chat ID | Invite Link | Channel Title</code>\n\n" +
      "<b>" + sc("Example:") + "</b>\n<code>-1009876543210 | https://t.me/+ReqLink123 | VIP Request</code>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

var chatId = parts[0].trim();
var inviteLink = parts[1].trim();
var title = (parts.length >= 3 && parts[2].trim()) ? parts[2].trim() : ("Request Channel (" + chatId.slice(-4) + ")");

if (chatId.indexOf("-") !== 0 && chatId.indexOf("100") !== 0) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Invalid Chat ID! Telegram channel IDs start with -100.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

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

var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

// Check duplicate
var exists = false;
for (var j = 0; j < mustJoin.length; j++) {
  if (String(mustJoin[j].id) === chatId) {
    exists = true;
    break;
  }
}

if (exists) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("This channel is already in the mandatory join list!") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

mustJoin.push({
  id: chatId,
  title: title,
  url: inviteLink,
  type: "request"
});

Bot.setProperty("must_join", mustJoin, "json");

var successText = "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("PRIVATE REQUEST CHANNEL ADDED SUCCESSFULLY!") + "</b>\n\n" +
  "🏷️ <b>" + sc("Title:") + "</b> <code>" + title + "</code>\n" +
  "🆔 <b>" + sc("Chat ID:") + "</b> <code>" + chatId + "</code>\n" +
  "🔗 <b>" + sc("Request Link:") + "</b> " + inviteLink + "\n" +
  "📩 <b>" + sc("Type:") + "</b> " + sc("Private Join Request Channel");

Api.sendMessage({
  chat_id: chat.chatid,
  text: successText,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: Libs.emojiHelper.admin_keyboard()
});
