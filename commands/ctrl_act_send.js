/*CMD
  command: ctrl_act_send
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

if (typeof request !== "undefined" && request && request.id) {
  try { Api.answerCallbackQuery({ callback_query_id: request.id }); } catch (e) {}
}

var cId = User.getProperty("current_ctrl_chat_id");
if (!cId) {
  Bot.runCommand("admin_channel_control");
  return;
}

var text = "<tg-emoji emoji-id='6154631793787015439'>✉️</tg-emoji> <b>" + sc("SEND MESSAGE TO CHANNEL") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
  "📢 <b>" + sc("Channel ID:") + "</b> <code>" + cId + "</code>\n\n" +
  sc("Ab wo message likhkar send karein jo aap is channel me post karna chahte hain (HTML formatting supported):");

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
  command: "/ctrl_process_send"
});
