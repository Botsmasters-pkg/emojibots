/*CMD
  command: /process_button_name
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
var postData = User.getProperty("current_post_data");
if (!postData) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Session expired! Please click MAKE POST to create a new post.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.main_menu(user.telegramid)
  });
  return;
}

if (!message) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("PLEASE PROVIDE A VALID BUTTON NAME!") + "</b>",
    parse_mode: "html"
  });
  Bot.run({ command: "/process_button_name" });
  return;
}

var emojiDb = Bot.getProperty("emoji_db") || {};
var btnEmojis = emojiDb.button || Libs.emojiHelper.DEFAULT_BUTTON_EMOJIS;
var chosenIcon = btnEmojis[Math.floor(Math.random() * btnEmojis.length)];

var text = message;
var cleaned = "";
for (var i = 0; i < text.length; i++) {
  if (!Libs.emojiHelper.is_emoji(text[i])) {
    cleaned += text[i];
  }
}
cleaned = cleaned.trim();
if (!cleaned) cleaned = "Button";

User.setProperty("current_btn_name", cleaned, "string");
User.setProperty("current_btn_icon", chosenIcon, "string");

var promptUrl = "<tg-emoji emoji-id='6154729229415093721'>📎</tg-emoji> <b>" + sc("PLEASE SEND THE DESTINATION LINK URL FOR THIS BUTTON (e.g., https://t.me/...):") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: promptUrl,
  parse_mode: "html"
});

Bot.run({
  command: "/process_button_link"
});