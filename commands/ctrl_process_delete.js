/*CMD
  command: /ctrl_process_delete
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
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Please provide a valid Post Link or Message ID.") + "</b>",
    parse_mode: "html"
  });
  return;
}

var input = message.trim();
var msgId = null;

if (input.indexOf("http") === 0 || input.indexOf("t.me") === 0) {
  var parts = input.split("/");
  var lastPart = parts[parts.length - 1];
  var parsed = parseInt(lastPart, 10);
  if (!isNaN(parsed)) {
    msgId = parsed;
  }
} else {
  var directNum = parseInt(input, 10);
  if (!isNaN(directNum)) {
    msgId = directNum;
  }
}

if (!msgId) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Invalid Message ID or Link format!") + "</b>\n\n" +
      "<b>Example:</b> <code>https://t.me/mychannel/45</code> ya <code>45</code>",
    parse_mode: "html",
    reply_markup: {
      inline_keyboard: [[
        { text: sc("🔙 BACK TO CHANNEL"), callback_data: "ctrl_ch_" + cId, style: "primary", icon_custom_emoji_id: "5303040006347046717" }
      ]]
    }
  });
  return;
}

User.setProperty("ctrl_del_msg_id", String(msgId), "string");

Api.deleteMessage({
  chat_id: cId,
  message_id: msgId,
  on_result: "/onCtrlDeleteDone",
  on_error: "/onCtrlDeleteDone"
});
