/*CMD
  command: /onCtrlLinkResult
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

var cId = User.getProperty("current_ctrl_chat_id");
var link = (typeof options !== "undefined" && options && options.result) ? options.result : null;

var ctrlChannels = Bot.getProperty("bot_controlled_channels") || {};
var cObj = ctrlChannels[cId] || {};
if (!link && cObj.username) {
  link = "https://t.me/" + cObj.username.replace("@", "");
}
if (!link) {
  link = cObj.link || ("https://t.me/c/" + String(cId).replace(/^-100/, ""));
}

var text = "<tg-emoji emoji-id='6154729229415093721'>🔗</tg-emoji> <b>" + sc("CHANNEL INVITE LINK:") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
  "📢 <b>" + sc("Channel:") + "</b> " + (cObj.title || cId) + "\n" +
  "🆔 <b>" + sc("Chat ID:") + "</b> <code>" + cId + "</code>\n\n" +
  "👉 <b>" + sc("Link:") + "</b> " + link;

var markup = {
  inline_keyboard: [
    [
      { text: sc("🌐 OPEN LINK"), url: link, style: "primary", icon_custom_emoji_id: "6154631793787015439" }
    ],
    [
      { text: sc("🔙 BACK TO CHANNEL"), callback_data: "ctrl_ch_" + cId, style: "success", icon_custom_emoji_id: "5303040006347046717" }
    ]
  ]
};

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: markup
});
