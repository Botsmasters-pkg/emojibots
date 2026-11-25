/*CMD
  command: admin_remove_emoji
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
var adminId = "8710308658";
if (String(user.telegramid) !== adminId) return;

var msg = "<tg-emoji emoji-id='5870869476408299692'>🗑</tg-emoji> <b>" + sc("Aap ek ya ek se zyada Emoji IDs ek saath bhej sakte hain remove karne ke liye (space ya newline se alag karke):") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_navigation_markup()
});

Bot.run({
  command: "/remove_emoji_id"
});