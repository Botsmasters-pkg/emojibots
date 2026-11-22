/*CMD
  command: /onVerifySendChannel
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
var pid = User.getProperty("exec_pid");
var cid = User.getProperty("exec_cid");
var member = (typeof options !== "undefined" && options && options.result) ? options.result : null;

var isChannelAdmin = false;
if (member && (member.status === "administrator" || member.status === "creator")) {
  isChannelAdmin = true;
}

if (!isChannelAdmin) {
  var userChannels = Bot.getProperty("user_channels") || {};
  var ulist = userChannels[user.telegramid] || [];
  var updated = [];
  for (var i = 0; i < ulist.length; i++) {
    if (String(ulist[i].id) !== String(cid)) {
      updated.push(ulist[i]);
    }
  }
  userChannels[user.telegramid] = updated;
  Bot.setProperty("user_channels", userChannels, "json");

  if (request && request.id) {
    Api.answerCallbackQuery({
      callback_query_id: request.id,
      text: sc("YOU ARE NOT ADMIN IN THIS CHANNEL!"),
      show_alert: true
    });
  }

  var deniedText = "<tg-emoji emoji-id='5870619152829386951'>🚫</tg-emoji> <b>" + sc("YOU ARE NOT ADMIN IN THIS CHANNEL!") + "</b>\n\n" +
    "<b>" + sc("Aap is channel ke admin nahi hain ya aapko admin se hata diya gaya hai.") + "</b>\n" +
    "<i>" + sc("Is channel me post publish nahi ki ja sakti.") + "</i>";

  Api.sendMessage({
    chat_id: chat.chatid,
    text: deniedText,
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.main_menu(user.telegramid)
  });
  return;
}

var postsDb = Bot.getProperty("posts_db") || {};
var data = postsDb[pid];

if (!data) {
  if (request && request.id) {
    Api.answerCallbackQuery({
      callback_query_id: request.id,
      text: "Post not found or expired.",
      show_alert: true
    });
  }
  return;
}

var markupRows = [];
for (var j = 0; j < (data.buttons || []).length; j++) {
  var btn = data.buttons[j];
  var btnObj = {
    text: btn.name,
    url: btn.url,
    icon_custom_emoji_id: btn.icon_custom_emoji_id
  };
  if (btn.style) {
    btnObj.style = btn.style;
  }
  markupRows.push([btnObj]);
}
var postMarkup = (markupRows.length > 0) ? { inline_keyboard: markupRows } : undefined;

if (data.photo_id) {
  Api.sendPhoto({
    chat_id: cid,
    photo: data.photo_id,
    caption: data.content,
    parse_mode: "html",
    reply_markup: postMarkup
  });
} else {
  Api.sendMessage({
    chat_id: cid,
    text: data.content,
    parse_mode: "html",
    reply_markup: postMarkup
  });
}

var successText = "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("POST PUBLISHED SUCCESSFULLY TO CHANNEL!") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: successText,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.main_menu(user.telegramid)
});