/*CMD
  command: btn_skip
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