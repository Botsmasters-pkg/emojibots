/*CMD
  command: /ask_for_buttons
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

var buttons = postData.buttons || [];
var rows = [];
if (buttons.length === 0) {
  rows.push([
    { text: sc("SKIP BUTTON"), callback_data: "btn_skip", style: "danger", icon_custom_emoji_id: "5870869476408299692" }
  ]);
} else {
  rows.push([
    { text: sc("DONE & FINALIZE"), callback_data: "btn_done", style: "success", icon_custom_emoji_id: "6154718341672997377" }
  ]);
}

var promptText = "<tg-emoji emoji-id='6154635564768300782'>📌</tg-emoji> <b>" + sc("PLEASE ENTER THE BUTTON NAME (Aap yahan normal emoji bhi daal sakte ho, wo animated custom emoji ban jayega!):") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: promptText,
  parse_mode: "html",
  reply_markup: { inline_keyboard: rows }
});

Bot.run({
  command: "/process_button_name"
});