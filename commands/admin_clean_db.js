/*CMD
  command: admin_clean_db
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

Bot.setProperty("posts_db", {}, "json");

var msg = "<tg-emoji emoji-id='5870869476408299692'>🧹</tg-emoji> <b>" + sc("Posts database cleaned successfully! All temporary posts cleared.") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_navigation_markup()
});