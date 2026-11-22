/*CMD
  command: admin_list_btn_emojis
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
var adminId = "8710308658";
if (String(user.telegramid) !== adminId) return;

var emojiDb = Bot.getProperty("emoji_db") || {};
var btnEmojis = emojiDb.button || Libs.emojiHelper.DEFAULT_BUTTON_EMOJIS;

var btnList = "";
for (var i = 0; i < btnEmojis.length; i++) {
  btnList += "• <code>" + btnEmojis[i] + "</code>\n";
}
if (!btnList) btnList = sc("No button emojis.");

var msg = "<tg-emoji emoji-id='6154659543570714696'>📋</tg-emoji> <b>" + sc("BUTTON EMOJIS DATABASE LIST") + " (Total: " + btnEmojis.length + "):</b>\n\n" + btnList;

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_navigation_markup()
});