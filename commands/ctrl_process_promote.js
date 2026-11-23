/*CMD
  command: /ctrl_process_promote
  help: 
  need_reply: true
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
if (!cId) {
  Bot.runCommand("admin_channel_control");
  return;
}

if (!message) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Please provide a valid User ID.") + "</b>",
    parse_mode: "html",
    reply_markup: {
      inline_keyboard: [[
        { text: sc("🔙 BACK TO CHANNEL"), callback_data: "ctrl_ch_" + cId, style: "primary", icon_custom_emoji_id: "5303040006347046717" }
      ]]
    }
  });
  return;
}

var targetUserId = message.trim();
User.setProperty("ctrl_promote_target_id", targetUserId, "string");

Api.promoteChatMember({
  chat_id: cId,
  user_id: targetUserId,
  can_manage_chat: true,
  can_post_messages: true,
  can_edit_messages: true,
  can_delete_messages: true,
  can_invite_users: true,
  on_result: "/onCtrlPromoteDone",
  on_error: "/onCtrlPromoteDone"
});
