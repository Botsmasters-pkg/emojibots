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

var helper = (typeof Libs !== "undefined" && Libs) ? (Libs.emojiHelper || Libs.EmojiHelper) : null;
var sc = (helper && helper.sc) ? helper.sc : function(s) { return s || ""; };
var postData = User.getProperty("current_post_data");
if (!postData) {
  if (message && message.indexOf("/") === 0) {
    Bot.runCommand(message);
    return;
  }
  return;
}

if (message && (message === "/start" || message === "/cancel" || message === "/admin")) {
  User.setProperty("current_post_data", null, "json");
  Bot.runCommand(message === "/cancel" ? "back_to_main" : message);
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