/*CMD
  command: admin_export_users
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

var users = Bot.getProperty("users") || [];

var text = "<tg-emoji emoji-id='6154659543570714696'>📊</tg-emoji> <b>" + sc("Complete Registered Users Database List") + "</b> (Total: " + users.length + "):\n\n";

var limit = Math.min(users.length, 50);
for (var i = 0; i < limit; i++) {
  text += "• <code>" + users[i] + "</code>\n";
}
if (users.length > 50) {
  text += "\n<i>...and " + (users.length - 50) + " more users.</i>";
}

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_navigation_markup()
});