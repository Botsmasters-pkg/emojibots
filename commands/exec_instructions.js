/*CMD
  command: exec_instructions
  help: Action to render Instructions guide once verified
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

var sc = Libs.emojiHelper.sc;

var text = "<tg-emoji emoji-id='6154314868150243661'>📖</tg-emoji> <b>" + sc("DETAILED COMPREHENSIVE GUIDE & INSTRUCTIONS:") + "</b>\n\n" +
  "1. **" + sc("MAKE POST") + "**: " + sc("Click karke apna text bhejein. Text ke andar ke normal emojis automatic high-quality custom emojis me convert ho jayenge.") + "\n" +
  "2. **" + sc("MEDIA & BUTTONS") + "**: " + sc("Aap optional image ya video attach kar sakte hain aur multiple custom styled buttons add kar sakte hain.") + "\n" +
  "3. **" + sc("CONNECT CHANNELS") + "**: " + sc("Apne channel ko connect karne ke liye bot ko channel par admin banayein aur channel username ya message forward karein.") + "\n" +
  "4. **" + sc("SEND TO CHANNEL") + "**: " + sc("Apna Unique Post ID enter karein aur connect kiye gaye channel par instant dispatch karein.");

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: Libs.emojiHelper.main_menu(user.telegramid)
});
