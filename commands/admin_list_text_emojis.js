/*CMD
  command: admin_list_text_emojis
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
var textEmojis = emojiDb.text || Libs.emojiHelper.DEFAULT_TEXT_EMOJIS;

var textList = "";
for (var i = 0; i < textEmojis.length; i++) {
  textList += "• <code>" + textEmojis[i] + "</code>\n";
}
if (!textList) textList = sc("No text emojis.");

var msg = "<tg-emoji emoji-id='6154659543570714696'>📋</tg-emoji> <b>" + sc("TEXT EMOJIS DATABASE LIST") + " (Total: " + textEmojis.length + "):</b>\n\n" + textList;

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_navigation_markup()
});