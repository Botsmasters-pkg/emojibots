/*CMD
  command: /onVerifySelectChannel
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
var userChannels = Bot.getProperty("user_channels") || {};
var ulist = userChannels[user.telegramid] || [];
var idx = User.getProperty("channel_check_idx") || 0;
var validList = User.getProperty("valid_channels_list") || [];
var postId = User.getProperty("sending_post_id");

var member = (typeof options !== "undefined" && options && options.result) ? options.result : null;
if (member && (member.status === "administrator" || member.status === "creator")) {
  validList.push(ulist[idx]);
}

var nextIdx = idx + 1;
if (nextIdx < ulist.length) {
  User.setProperty("channel_check_idx", nextIdx, "integer");
  User.setProperty("valid_channels_list", validList, "json");
  Api.getChatMember({
    chat_id: ulist[nextIdx].id,
    user_id: user.telegramid,
    on_result: "/onVerifySelectChannel",
    on_error: "/onVerifySelectChannel"
  });
  return;
}

userChannels[user.telegramid] = validList;
Bot.setProperty("user_channels", userChannels, "json");

if (validList.length === 0) {
  var deniedText = "<tg-emoji emoji-id='5870619152829386951'>🚫</tg-emoji> <b>" + sc("YOU ARE NOT ADMIN IN THIS CHANNEL!") + "</b>\n\n" +
    "<b>" + sc("Aap kisi bhi connected channel ke admin nahi hain (ya aapko admin se hata diya gaya hai).") + "</b>\n" +
    "<i>" + sc("Channel me post dispatch karne ke liye aapka us channel me Admin hona zaroori hai.") + "</i>";
  
  Api.sendMessage({
    chat_id: chat.chatid,
    text: deniedText,
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.main_menu(user.telegramid)
  });
  return;
}

var rows = [];
for (var i = 0; i < validList.length; i++) {
  var chan = validList[i];
  rows.push([
    {
      text: chan.title,
      callback_data: "send_" + postId + "_" + chan.id,
      style: "primary",
      icon_custom_emoji_id: "6154631793787015439"
    }
  ]);
}

var selectMsg = "<tg-emoji emoji-id='6154635564768300782'>📌</tg-emoji> <b>" + sc("SELECT DESTINATION CHANNEL TO PUBLISH:") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: selectMsg,
  parse_mode: "html",
  reply_markup: { inline_keyboard: rows }
});