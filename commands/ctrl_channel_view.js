/*CMD
  command: ctrl_channel_view
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

var targetChatId = (typeof params === "string" && params) ? params.trim() : User.getProperty("current_ctrl_chat_id");
if (!targetChatId) {
  Bot.runCommand("admin_channel_control");
  return;
}

User.setProperty("current_ctrl_chat_id", targetChatId, "string");

// Verify bot is currently admin in this channel before showing dashboard
var botTgId = Libs.emojiHelper.get_bot_id() || bot.id;
Api.getChatMember({
  chat_id: targetChatId,
  user_id: botTgId,
  on_result: "/onCtrlVerifyBotAdmin",
  on_error: "/onCtrlVerifyBotAdmin"
});
