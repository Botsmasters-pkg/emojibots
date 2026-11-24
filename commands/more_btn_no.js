/*CMD
  command: more_btn_no
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

var sc = Libs.emojiHelper.sc;
var postData = User.getProperty("current_post_data");
if (!postData) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("Session expired! Please click MAKE POST to create a new post.") + "</b>",
    parse_mode: "html",
    reply_markup: Libs.emojiHelper.main_menu(user.telegramid)
  });
  return;
}

Bot.runCommand("/finalize_post");