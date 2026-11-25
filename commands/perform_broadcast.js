/*CMD
  command: /perform_broadcast
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
var adminId = "8710308658";
if (String(user.telegramid) !== adminId) return;

if (!message) return;

var users = Bot.getProperty("users") || [];
var success = 0;
var fail = 0;

for (var i = 0; i < users.length; i++) {
  try {
    if (request && request.photo && request.photo.length > 0) {
      Api.sendPhoto({
        chat_id: users[i],
        photo: request.photo[request.photo.length - 1].file_id,
        caption: request.caption || "",
        parse_mode: "html"
      });
    } else if (request && request.video && request.video.file_id) {
      Api.sendVideo({
        chat_id: users[i],
        video: request.video.file_id,
        caption: request.caption || "",
        parse_mode: "html"
      });
    } else {
      Api.sendMessage({
        chat_id: users[i],
        text: message,
        parse_mode: "html"
      });
    }
    success++;
  } catch (e) {
    fail++;
  }
}

var resMsg = "<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>" + sc("Broadcast Completed Successfully!") + "</b>\n\n• Sent: <code>" + success + "</code>\n• Failed: <code>" + fail + "</code>";

Api.sendMessage({
  chat_id: adminId,
  text: resMsg,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_keyboard()
});
