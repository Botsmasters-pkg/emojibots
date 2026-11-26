/*CMD
  command: /onVerifyChannelUser
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
var target = User.getProperty("verifying_chat_id");
var member = (typeof options !== "undefined" && options && options.result) ? options.result : null;

var status = member ? member.status : "unknown";

if (status !== "administrator" && status !== "creator") {
  var deniedText = "<tg-emoji emoji-id='5870619152829386951'>🚫</tg-emoji> <b>" + sc("YOU ARE NOT ADMIN IN THIS CHANNEL!") + "</b>\n\n" +
    "<b>" + sc("Aap is channel ke Admin ya Owner nahi hain.") + "</b>\n\n" +
    "<i>" + sc("Channel connect karne ke liye aapka is channel me Admin ya Owner hona zaroori hai.") + "</i>";
  
  Api.sendMessage({
    chat_id: chat.chatid,
    text: deniedText,
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.main_menu(user.telegramid)
  });
  return;
}

var userChannels = Bot.getProperty("user_channels") || {};
var ulist = userChannels[user.telegramid] || [];

var exists = false;
for (var i = 0; i < ulist.length; i++) {
  if (String(ulist[i].id) === String(target)) {
    exists = true;
    break;
  }
}

if (!exists) {
  ulist.push({
    id: target,
    title: target
  });
  userChannels[user.telegramid] = ulist;
  Bot.setProperty("user_channels", userChannels, "json");
}

var successText = "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("CHANNEL CONNECTED SUCCESSFULLY") + "</b>: " + target;

Api.sendMessage({
  chat_id: chat.chatid,
  text: successText,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.main_menu(user.telegramid)
});