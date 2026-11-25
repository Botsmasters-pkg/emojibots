/*CMD
  command: /finalize_post
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
var data = User.getProperty("current_post_data");
if (!data) return;

User.setProperty("is_finalizing_post", true, "boolean");
User.setProperty("last_post_created_time", Date.now(), "integer");
User.setProperty("current_post_data", null, "json");

var postsDb = Bot.getProperty("posts_db") || {};
postsDb[data.id] = data;
Bot.setProperty("posts_db", postsDb, "json");

var markupRows = [];
var curRow = [];
for (var i = 0; i < (data.buttons || []).length; i++) {
  var btn = data.buttons[i];
  if (!btn || !btn.url || !btn.url.trim()) continue;
  var btnUrl = btn.url.trim();
  if (btnUrl.indexOf("http://") !== 0 && btnUrl.indexOf("https://") !== 0 && btnUrl.indexOf("tg://") !== 0) {
    btnUrl = "https://" + btnUrl;
  }
  var btnObj = {
    text: btn.name || "Button",
    url: btnUrl
  };
  if (btn.icon_custom_emoji_id) {
    btnObj.icon_custom_emoji_id = btn.icon_custom_emoji_id;
  }
  if (btn.style) {
    btnObj.style = btn.style;
  }
  curRow.push(btnObj);
  if (curRow.length === 2) {
    markupRows.push(curRow);
    curRow = [];
  }
}
if (curRow.length > 0) {
  markupRows.push(curRow);
}

var replyMarkup = (markupRows.length > 0) ? { inline_keyboard: markupRows } : undefined;

var successNotice = "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("POST CREATED SUCCESSFULLY! UNIQUE POST ID") + ":</b> <code>" + data.id + "</code>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: successNotice,
  parse_mode: "html"
});

if (data.media_type === "video" || data.video_id) {
  Api.sendVideo({
    chat_id: chat.chatid,
    video: data.video_id || data.media_id,
    caption: data.content,
    parse_mode: "html",
    reply_markup: replyMarkup
  });
} else if (data.media_type === "photo" || data.photo_id) {
  Api.sendPhoto({
    chat_id: chat.chatid,
    photo: data.photo_id || data.media_id,
    caption: data.content,
    parse_mode: "html",
    reply_markup: replyMarkup
  });
} else {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: data.content,
    parse_mode: "html",
    reply_markup: replyMarkup
  });
}

var completeText = "<tg-emoji emoji-id='6154314868150243661'>🎁</tg-emoji> <b>" + sc("Aapka post tayar hai! Ab aap niche diye gaye main menu se channel connect karke post bhej sakte hain:") + "</b>\n\n<b><b>" + sc("DEVELOPER") + "</b> : @codevexa</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: completeText,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.main_menu(user.telegramid)
});

User.setProperty("is_finalizing_post", false, "boolean");
