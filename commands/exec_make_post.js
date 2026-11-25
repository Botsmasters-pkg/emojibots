/*CMD
  command: exec_make_post
  help: Action to start post creation once verified
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

var msg = "<tg-emoji emoji-id='5337310516769467285'>📝</tg-emoji> <b>" + sc("PLEASE SEND YOUR TEXT CONTENT WITH NORMAL Emojis (wo automatic custom emojis me convert ho jayenge):") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html"
});

Bot.run({
  command: "/save_text_content"
});
