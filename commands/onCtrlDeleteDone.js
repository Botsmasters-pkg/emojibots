/*CMD
  command: /onCtrlDeleteDone
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

var cId = User.getProperty("current_ctrl_chat_id");
var msgId = User.getProperty("ctrl_del_msg_id") || "Post";
var success = (typeof options !== "undefined" && options && options.result === true);

var text = "";
if (success) {
  text = "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("MESSAGE DELETED SUCCESSFULLY FROM CHANNEL!") + "</b>\n\n" +
         "🗑️ <b>" + sc("Deleted Message ID:") + "</b> <code>" + msgId + "</code>\n" +
         "📢 <b>" + sc("Channel ID:") + "</b> <code>" + cId + "</code>";
} else {
  text = "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("DELETE FAILED!") + "</b>\n\n" +
         sc("Kripya check karein ki:\n1. Message ID sahi hai ya message pehle se deleted hai.\n2. Bot ke paas 'Delete Messages' (can_delete_messages) ka right hai.");
}

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: {
    inline_keyboard: [[
      { text: sc("🔙 BACK TO CHANNEL"), callback_data: "ctrl_ch_" + cId, style: "primary", icon_custom_emoji_id: "5303040006347046717" }
    ]]
  }
});
