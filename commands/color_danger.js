/*CMD
  command: color_danger
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: color_success, color_primary, color_skip
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

var cmd = command;
var styleVal = null;
if (cmd === "color_danger") styleVal = "danger";
else if (cmd === "color_success") styleVal = "success";
else if (cmd === "color_primary") styleVal = "primary";

var name = User.getProperty("current_btn_name") || "Button";
var url = User.getProperty("current_btn_url") || "";
var iconId = User.getProperty("current_btn_icon") || null;

var btnDict = {
  name: name,
  url: url,
  icon_custom_emoji_id: iconId
};
if (styleVal) {
  btnDict.style = styleVal;
}

postData.buttons = postData.buttons || [];
postData.buttons.push(btnDict);
User.setProperty("current_post_data", postData, "json");

var addedMsg = "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("BUTTON ADDED SUCCESSFULLY!") + "</b> (Total: " + postData.buttons.length + ")";
Api.sendMessage({
  chat_id: chat.chatid,
  text: addedMsg,
  parse_mode: "html"
});

var moreMarkup = {
  inline_keyboard: [
    [
      { text: sc("ADD MORE BUTTON"), callback_data: "more_btn_yes", style: "success", icon_custom_emoji_id: "6154718341672997377" },
      { text: sc("FINISH & PUBLISH"), callback_data: "more_btn_no", style: "primary", icon_custom_emoji_id: "5303040006347046717" }
    ]
  ]
};

var promptMore = "<tg-emoji emoji-id='6154635564768300782'>📌</tg-emoji> <b>" + sc("Kya aapko aur bhi buttons add karne hain ya is post ko finalize karein?") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: promptMore,
  parse_mode: "html",
  reply_markup: moreMarkup
});