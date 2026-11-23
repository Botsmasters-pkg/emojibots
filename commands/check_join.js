/*CMD
  command: check_join
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

if (typeof request !== "undefined" && request && request.id) {
  try {
    Api.answerCallbackQuery({ callback_query_id: request.id });
  } catch (e) {}
}

var mustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;

User.setProperty("fsub_index", 0, "integer");
Api.getChatMember({
  chat_id: mustJoin[0],
  user_id: user.telegramid,
  on_result: "/onVerifyJoinCallback",
  on_error: "back_to_main"
});