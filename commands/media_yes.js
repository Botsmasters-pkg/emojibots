/*CMD
  command: media_yes
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

var msg = "<tg-emoji emoji-id='5429651785352501917'>🖼</tg-emoji> <b>" + sc("PLEASE SEND YOUR IMAGE (PHOTO) OR VIDEO FILE NOW:") + "</b>\n\n" +
  "👉 <i>" + sc("Aap koi bhi photo ya video file send kar sakte hain, wo automatically post me attach ho jayega.") + "</i>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html"
});

Bot.run({
  command: "/save_photo_only"
});
