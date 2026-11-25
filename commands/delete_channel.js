/*CMD
  command: /delete_channel
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
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Please send a valid channel identifier.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

var input = message.trim();
var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var mustJoin = [];
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm) mustJoin.push(norm);
}

var removeIdx = -1;
var num = parseInt(input, 10);
if (!isNaN(num) && String(num) === input && num >= 1 && num <= mustJoin.length) {
  removeIdx = num - 1;
} else {
  var cleanInput = input.toLowerCase().replace(/^https?:\/\/t\.me\//, "").replace(/^@/, "").replace(/\/$/, "");
  for (var j = 0; j < mustJoin.length; j++) {
    var rawId = String(mustJoin[j].id).trim();
    var cleanId = rawId.toLowerCase().replace(/^@/, "");
    var cleanTitle = String(mustJoin[j].title).toLowerCase().replace(/^@/, "");
    if (rawId === input || cleanId === cleanInput || cleanTitle === cleanInput) {
      removeIdx = j;
      break;
    }
  }
}

if (removeIdx !== -1) {
  var removed = mustJoin.splice(removeIdx, 1)[0];
  Bot.setProperty("must_join", mustJoin, "json");
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("CHANNEL REMOVED SUCCESSFULLY!") + "</b>\n\n" +
      "🗑️ <b>" + sc("Removed:") + "</b> <code>" + removed.title + "</code> (" + removed.id + ")",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
} else {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Channel not found in list. Please check the list and try again.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
}
