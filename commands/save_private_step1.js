/*CMD
  command: /save_private_step1
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
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Please send a valid Chat ID.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

var input = message.trim();

// If user sent both ID and link separated by | in one message:
if (input.indexOf("|") !== -1) {
  var parts = input.split("|");
  var cId = parts[0].trim();
  var link = parts[1].trim();
  if (link.indexOf("http") !== 0) link = "https://" + link;
  
  var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
  var mustJoin = [];
  for (var i = 0; i < rawMustJoin.length; i++) {
    var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
    if (norm) mustJoin.push(norm);
  }
  mustJoin.push({
    id: cId,
    title: "Private Channel (" + cId.slice(-4) + ")",
    url: link,
    type: "private"
  });
  Bot.setProperty("must_join", mustJoin, "json");
  
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("PRIVATE CHANNEL ADDED SUCCESSFULLY!") + "</b>\n\n" +
      "🆔 <b>Chat ID:</b> <code>" + cId + "</code>\n" +
      "🔗 <b>Link:</b> " + link,
    parse_mode: "html",
    disable_web_page_preview: true,
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

var chatId = input;
if (chatId.indexOf("-") !== 0 && chatId.indexOf("100") !== 0) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Invalid Chat ID! Telegram channel ID must start with -100.") + "</b>\n\n" +
      "<b>Example:</b> <code>-1001234567890</code>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

if (chatId.indexOf("-100") !== 0 && chatId.indexOf("100") === 0) {
  chatId = "-" + chatId;
}

User.setProperty("temp_private_chat_id", chatId, "string");

var promptNext = "<tg-emoji emoji-id='6154729229415093721'>📎</tg-emoji> <b>" + sc("ADD PRIVATE FORCE JOIN CHANNEL (Step 2/2)") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n" +
  "🆔 <b>" + sc("Saved Chat ID:") + "</b> <code>" + chatId + "</code>\n\n" +
  "👉 <b>" + sc("Ab is Private Channel ka Invite Link send karein:") + "</b>\n" +
  "<b>" + sc("Example:") + "</b> <code>https://t.me/+AbCdEfGh</code>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: promptNext,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_navigation_markup()
});

Bot.run({
  command: "/save_private_step2"
});
