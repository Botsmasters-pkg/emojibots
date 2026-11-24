/*CMD
  command: btn_done
  help: 
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

var isFinalizing = User.getProperty("is_finalizing_post");
if (isFinalizing) return;

var lastPostTime = User.getProperty("last_post_created_time");
if (lastPostTime && (Date.now() - lastPostTime < 4000)) return;

Bot.runCommand("/finalize_post");