/*CMD
  command: admin_add_btn_emoji
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

var msg = "<tg-emoji emoji-id='6154718341672997377'>➕</tg-emoji> <b>" + sc("Aap ek ya ek se zyada Button Custom Emoji IDs ek saath bhej sakte hain (space ya newline se alag karke):") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_navigation_markup()
});

Bot.run({
  command: "/save_new_btn_emoji"
});