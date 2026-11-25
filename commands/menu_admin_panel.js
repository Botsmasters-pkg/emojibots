/*CMD
  command: menu_admin_panel
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var helper = (typeof Libs !== "undefined" && Libs) ? (Libs.emojiHelper || Libs.EmojiHelper) : null;
var sc = (helper && helper.sc) ? helper.sc : function(s) { return s || ""; };
var adminId = "8710308658";

if (String(user.telegramid) !== adminId) {
  if (typeof request !== "undefined" && request && request.id) {
    try {
      Api.answerCallbackQuery({
        callback_query_id: request.id,
        text: sc("Unauthorized Access!"),
        show_alert: true
      });
    } catch (e) {}
  }
  return;
}

if (typeof request !== "undefined" && request && request.id) {
  try {
    Api.answerCallbackQuery({ callback_query_id: request.id });
  } catch (e) {}
}

var text = "<tg-emoji emoji-id='6154611916678369390'>👑</tg-emoji> <b>" + sc("ADMIN CONTROL MANAGEMENT PANEL:") + "</b>\n\n" +
  sc("Yahan se aap bot ke saare controls, channels list, custom emojis database aur user analytics manage kar sakte hain.");

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.admin_keyboard()
});