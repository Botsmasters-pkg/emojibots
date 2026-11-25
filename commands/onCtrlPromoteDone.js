/*CMD
  command: /onCtrlPromoteDone
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
var targetId = User.getProperty("ctrl_promote_target_id") || "User";
var success = (typeof options !== "undefined" && options && options.result === true);

var text = "";
if (success) {
  text = "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("USER PROMOTED SUCCESSFULLY!") + "</b>\n\n" +
         "👤 <b>" + sc("User ID:") + "</b> <code>" + targetId + "</code>\n" +
         "📢 <b>" + sc("Channel ID:") + "</b> <code>" + cId + "</code>\n\n" +
         sc("Is user ko channel me Administrator rights de diye gaye hain.");
} else {
  text = "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("PROMOTE FAILED!") + "</b>\n\n" +
         sc("Kripya check karein ki:\n1. Bot ke paas 'Add New Admins' (can_promote_members) ki permission hai ya nahi.\n2. User channel ka member hai ya nahi.\n3. User ID sahi hai ya nahi.");
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
