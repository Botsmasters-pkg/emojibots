/*CMD
  command: /save_photo_only
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

var photoId = null;
if (request && request.photo && request.photo.length > 0) {
  photoId = request.photo[request.photo.length - 1].file_id;
} else if (request && request.document && request.document.mime_type && request.document.mime_type.indexOf("image") === 0) {
  photoId = request.document.file_id;
}

if (!photoId) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("PLEASE UPLOAD A VALID IMAGE FILE!") + "</b>",
    parse_mode: "html"
  });
  Bot.run({ command: "/save_photo_only" });
  return;
}

postData.photo_id = photoId;
User.setProperty("current_post_data", postData, "json");

Bot.runCommand("/ask_for_buttons");