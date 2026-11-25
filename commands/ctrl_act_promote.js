/*CMD
  command: ctrl_act_promote
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

var text = "<tg-emoji emoji-id='6154718341672997377'>⬆️</tg-emoji> <b>" + sc("PROMOTE USER TO ADMINISTRATOR") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
  "📢 <b>" + sc("Target Channel ID:") + "</b> <code>" + cId + "</code>\n\n" +
  sc("Jis user ko is channel me Admin banana hai uska") + " <b>" + sc("Telegram User ID") + "</b> " + sc("send karein:") + "\n\n" +
  "<b>" + sc("Example:") + "</b> <code>1234567890</code>\n\n" +
  "⚠️ <i>" + sc("Note: Iske liye bot ke paas channel me 'Add New Admins' (can_promote_members) ka right hona zaroori hai.") + "</i>";

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
  command: "/ctrl_process_promote"
});
