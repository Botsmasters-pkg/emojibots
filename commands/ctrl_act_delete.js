/*CMD
  command: ctrl_act_delete
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

if (typeof request !== "undefined" && request && request.id) {
  try { Api.answerCallbackQuery({ callback_query_id: request.id }); } catch (e) {}
}

var cId = User.getProperty("current_ctrl_chat_id");
if (!cId) {
  Bot.runCommand("admin_channel_control");
  return;
}

var text = "<tg-emoji emoji-id='5870869476408299692'>🗑️</tg-emoji> <b>" + sc("DELETE MESSAGE FROM CHANNEL") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
  "📢 <b>" + sc("Channel ID:") + "</b> <code>" + cId + "</code>\n\n" +
  sc("Delete karne ke liye Post ka") + " <b>" + sc("Link") + "</b> " + sc("ya") + " <b>" + sc("Message ID") + "</b> " + sc("send karein:") + "\n\n" +
  "<b>" + sc("Examples:") + "</b>\n" +
  "• <code>https://t.me/c/1234567890/45</code>\n" +
  "• <code>https://t.me/mychannel/45</code>\n" +
  "• <code>45</code>";

var markup = {
  inline_keyboard: [
    [
      { text: sc("🔙 CANCEL / BACK"), callback_data: "ctrl_ch_" + cId, style: "danger", icon_custom_emoji_id: "5870869476408299692" }
    ]
  ]
};

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: markup
});

Bot.run({
  command: "/ctrl_process_delete"
});
