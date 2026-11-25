/*CMD
  command: back_to_main
  help: Gate-protected Main Menu entry point
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

User.setProperty("gate_target", "exec_back_to_main", "string");
User.setProperty("gate_index", 0, "integer");
Bot.runCommand("gate_check_step");
