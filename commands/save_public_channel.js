/*CMD
  command: /save_public_channel
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

if (!message) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Please send a valid public channel username or link.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

var input = message.trim();
var username = input.replace(/^https?:\/\/t\.me\//i, "").replace(/^@/, "").replace(/\/$/, "").trim();

if (!username) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Invalid username format! Example: @mychannel") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

var chHandle = "@" + username;
var chUrl = "https://t.me/" + username;

var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

// Check duplicate
var exists = false;
for (var j = 0; j < mustJoin.length; j++) {
  if (mustJoin[j].id.toLowerCase() === chHandle.toLowerCase()) {
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
  id: chHandle,
  title: chHandle,
  url: chUrl,
  type: "public"
});

Bot.setProperty("must_join", mustJoin, "json");

var successText = "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("PUBLIC CHANNEL ADDED SUCCESSFULLY!") + "</b>\n\n" +
  "📢 <b>" + sc("Channel:") + "</b> <code>" + chHandle + "</code>\n" +
  "🔗 <b>" + sc("Link:") + "</b> " + chUrl + "\n" +
  "🌐 <b>" + sc("Type:") + "</b> " + sc("Public Channel");

Api.sendMessage({
  chat_id: chat.chatid,
  text: successText,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: Libs.emojiHelper.admin_keyboard()
});
