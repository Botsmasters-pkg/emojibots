/*CMD
  command: admin_list_channels
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

var mustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;

var chListStr = "";
for (var i = 0; i < mustJoin.length; i++) {
  chListStr += "• <code>" + mustJoin[i] + "</code>\n";
}
if (!chListStr) chListStr = sc("No channels configured.");

var text = "<tg-emoji emoji-id='6154659543570714696'>📋</tg-emoji> <b>" + sc("CURRENT MANDATORY JOIN CHANNELS LIST:") + "</b>\n\n" + chListStr;

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_navigation_markup()
});