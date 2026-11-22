/*CMD
  command: /save_new_btn_emoji
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
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Please send valid emoji IDs.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
  return;
}

var emojiDb = Bot.getProperty("emoji_db") || {
  text: Libs.emojiHelper.DEFAULT_TEXT_EMOJIS,
  button: Libs.emojiHelper.DEFAULT_BUTTON_EMOJIS
};

var ids = message.trim().split(/[\s,\n]+/);
var addedCount = 0;
for (var i = 0; i < ids.length; i++) {
  var eid = ids[i].trim();
  if (eid && /^\d+$/.test(eid) && emojiDb.button.indexOf(eid) === -1) {
    emojiDb.button.push(eid);
    addedCount++;
  }
}

Bot.setProperty("emoji_db", emojiDb, "json");

if (addedCount > 0) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + addedCount + " " + sc("Button emoji IDs successfully added to database!") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
} else {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("No valid or new IDs found.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.admin_keyboard()
  });
}