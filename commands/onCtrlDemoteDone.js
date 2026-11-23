/*CMD
  command: /onCtrlDemoteDone
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
var targetId = User.getProperty("ctrl_demote_target_id") || "User";
var success = (typeof options !== "undefined" && options && options.result === true);

var text = "";
if (success) {
  text = "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("ADMIN DEMOTED SUCCESSFULLY!") + "</b>\n\n" +
         "👤 <b>" + sc("User ID:") + "</b> <code>" + targetId + "</code>\n" +
         "📢 <b>" + sc("Channel ID:") + "</b> <code>" + cId + "</code>\n\n" +
         sc("Is user ke Administrator rights successfully revoke kar diye gaye hain.");
} else {
  text = "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("DEMOTE FAILED!") + "</b>\n\n" +
         sc("Kripya check karein ki user is channel ka admin hai ya nahi, ya bot ke paas rights hain ya nahi.");
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
