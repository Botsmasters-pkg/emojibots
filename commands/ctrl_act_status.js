/*CMD
  command: ctrl_act_status
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

Api.getChatMember({
  chat_id: cId,
  user_id: bot.id,
  on_result: "/onCtrlStatusResult",
  on_error: "/onCtrlStatusResult"
});
