/*CMD
  command: /onVerifyChannelError
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

var errText = "<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>" + sc("CHANNEL NOT FOUND OR PERMISSION DENIED. CHECK USERNAME.") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: errText,
  parse_mode: "html"
});