/*CMD
  command: /process_button_link
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
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("PLEASE PROVIDE A VALID URL!") + "</b>",
    parse_mode: "html"
  });
  Bot.run({ command: "/process_button_link" });
  return;
}

var url = message.trim();
if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0 && url.indexOf("t.me/") !== 0) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("INVALID URL FORMAT! PROVIDE A VALID LINK STARTING WITH http:// OR https://:") + "</b>",
    parse_mode: "html"
  });
  Bot.run({ command: "/process_button_link" });
  return;
}

User.setProperty("current_btn_url", url, "string");

var colorMarkup = {
  inline_keyboard: [
    [
      { text: sc("RED (DANGER)"), callback_data: "color_danger", style: "danger", icon_custom_emoji_id: "5870869476408299692" },
      { text: sc("GREEN (SUCCESS)"), callback_data: "color_success", style: "success", icon_custom_emoji_id: "6154718341672997377" }
    ],
    [
      { text: sc("BLUE (PRIMARY)"), callback_data: "color_primary", style: "primary", icon_custom_emoji_id: "6154631793787015439" },
      { text: sc("SKIP COLOR"), callback_data: "color_skip", style: "primary", icon_custom_emoji_id: "5870619152829386951" }
    ]
  ]
};

var promptColor = "<tg-emoji emoji-id='6154631793787015439'>🎨</tg-emoji> <b>" + sc("PLEASE SELECT YOUR PREFERRED BUTTON COLOR STYLE:") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: promptColor,
  parse_mode: "html",
  reply_markup: colorMarkup
});