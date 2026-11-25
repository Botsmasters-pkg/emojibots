/*CMD
  command: /save_text_content
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var helper = (typeof Libs !== "undefined" && Libs) ? (Libs.emojiHelper || Libs.EmojiHelper) : null;
var sc = (helper && helper.sc) ? helper.sc : function(s) { return s || ""; };

if (!message) {
  var sent = "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("PLEASE PROVIDE VALID TEXT CONTENT!") + "</b>";
  Api.sendMessage({ chat_id: chat.chatid, text: sent, parse_mode: "html" });
  Bot.run({ command: "/save_text_content" });
  return;
}

var processed = Libs.emojiHelper.processTextAndEmojis(message);

User.setProperty("current_post_data", {
  id: Libs.emojiHelper.generate_id(),
  content: processed,
  buttons: [],
  media_type: null,
  media_id: null,
  photo_id: null,
  video_id: null
}, "json");

var markup = {
  inline_keyboard: [
    [
      { text: sc("ADD MEDIA"), callback_data: "media_yes", style: "success", icon_custom_emoji_id: "5429651785352501917" },
      { text: sc("TEXT ONLY"), callback_data: "media_no", style: "primary", icon_custom_emoji_id: "5337310516769467285" }
    ]
  ]
};

var promptMedia = "<tg-emoji emoji-id='6154635564768300782'>📌</tg-emoji> <b>" + sc("DO YOU WANT TO ATTACH MEDIA (IMAGE OR VIDEO) TO YOUR POST?") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: promptMedia,
  parse_mode: "html",
  reply_markup: markup
});
