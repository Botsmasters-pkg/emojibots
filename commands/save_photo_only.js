/*CMD
  command: /save_photo_only
  help: Save uploaded photo or video media to current post
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

var mediaType = null;
var mediaId = null;

if (request && request.photo && request.photo.length > 0) {
  // Telegram compressed photo (highest resolution is last element)
  mediaType = "photo";
  mediaId = request.photo[request.photo.length - 1].file_id;
} else if (request && request.video && request.video.file_id) {
  // Telegram native video
  mediaType = "video";
  mediaId = request.video.file_id;
} else if (request && request.animation && request.animation.file_id) {
  // Telegram animation / GIF
  mediaType = "video";
  mediaId = request.animation.file_id;
} else if (request && request.document && request.document.file_id) {
  var doc = request.document;
  var mime = (doc.mime_type || "").toLowerCase();
  var fileName = (doc.file_name || "").toLowerCase();

  if (mime.indexOf("video") === 0 || fileName.match(/\.(mp4|mov|mkv|avi|webm|flv|3gp)$/)) {
    mediaType = "video";
    mediaId = doc.file_id;
  } else if (mime.indexOf("image") === 0 || fileName.match(/\.(jpg|jpeg|png|webp|bmp)$/)) {
    mediaType = "photo";
    mediaId = doc.file_id;
  }
}

if (!mediaId || !mediaType) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("PLEASE UPLOAD A VALID IMAGE (PHOTO) OR VIDEO FILE!") + "</b>\n\n" +
      "<i>" + sc("Kripya photo ya video file bhejein.") + "</i>",
    parse_mode: "html"
  });
  Bot.run({ command: "/save_photo_only" });
  return;
}

postData.media_type = mediaType;
postData.media_id = mediaId;
if (mediaType === "video") {
  postData.video_id = mediaId;
  postData.photo_id = null;
} else {
  postData.photo_id = mediaId;
  postData.video_id = null;
}

User.setProperty("current_post_data", postData, "json");

Bot.runCommand("/ask_for_buttons");
