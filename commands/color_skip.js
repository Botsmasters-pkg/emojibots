/*CMD
  command: color_skip
  help: 
  need_reply: false
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
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Session expired! Please click MAKE POST to create a new post.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.main_menu(user.telegramid)
  });
  return;
}

if (typeof request !== "undefined" && request && request.id) {
  try { Api.answerCallbackQuery({ callback_query_id: request.id }); } catch (e) {}
}

var name = User.getProperty("current_btn_name") || "Button";
var rawUrl = (User.getProperty("current_btn_url") || "").trim();
if (!rawUrl) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Button link missing! Please provide a valid URL for the button.") + "</b>",
    parse_mode: "html"
  });
  return;
}
var url = rawUrl;
if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0 && url.indexOf("tg://") !== 0) {
  url = "https://" + url;
}
var iconId = User.getProperty("current_btn_icon") || null;

var btnDict = {
  name: name,
  url: url
};
if (iconId) {
  btnDict.icon_custom_emoji_id = iconId;
}

postData.buttons = postData.buttons || [];
postData.buttons.push(btnDict);
User.setProperty("current_post_data", postData, "json");
User.setProperty("current_btn_name", null, "string");
User.setProperty("current_btn_url", null, "string");
User.setProperty("current_btn_icon", null, "string");

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