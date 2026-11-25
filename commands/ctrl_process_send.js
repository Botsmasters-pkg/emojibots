/*CMD
  command: /ctrl_process_send
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
var adminId = "8710308658";
if (String(user.telegramid) !== adminId) return;

var cId = User.getProperty("current_ctrl_chat_id");
if (!cId) {
  Bot.runCommand("admin_channel_control");
  return;
}

if (!message) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Please provide a valid message text.") + "</b>",
    parse_mode: "html"
  });
  return;
}

Api.sendMessage({
  chat_id: cId,
  text: message,
  parse_mode: "html"
});

var sentConfirm = "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("MESSAGE DISPATCHED TO CHANNEL SUCCESSFULLY!") + "</b>\n\n" +
  "📢 <b>" + sc("Channel ID:") + "</b> <code>" + cId + "</code>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: sentConfirm,
  parse_mode: "html",
  reply_markup: {
    inline_keyboard: [[
      { text: sc("🔙 BACK TO CHANNEL"), callback_data: "ctrl_ch_" + cId, style: "primary", icon_custom_emoji_id: "5303040006347046717" }
    ]]
  }
});
