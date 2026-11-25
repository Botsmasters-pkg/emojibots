/*CMD
  command: menu_instructions
  help: Gate-protected Instructions entry point
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

if (typeof request !== "undefined" && request && request.id) {
  try { Api.answerCallbackQuery({ callback_query_id: request.id }); } catch (e) {}
}

User.setProperty("gate_target", "exec_instructions", "string");
User.setProperty("gate_index", 0, "integer");
Bot.runCommand("gate_check_step");
