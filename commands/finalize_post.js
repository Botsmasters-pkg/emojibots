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

var sc = Libs.emojiHelper.sc;
var data = User.getProperty("current_post_data");
if (!data) return;

User.setProperty("current_post_data", null, "json");

var postsDb = Bot.getProperty("posts_db") || {};
postsDb[data.id] = data;
Bot.setProperty("posts_db", postsDb, "json");

var markupRows = [];
var curRow = [];
for (var i = 0; i < (data.buttons || []).length; i++) {
  var btn = data.buttons[i];
  var btnObj = {
    text: btn.name || "Button",
    url: btn.url
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

if (data.photo_id) {
  Api.sendPhoto({
    chat_id: chat.chatid,
    photo: data.photo_id,
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