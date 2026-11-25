/*CMD
  command: menu_make_post
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = "8710308658";
var isGateChecked = (typeof options !== "undefined" && options && options.gate_passed);

if (String(user.telegramid) !== adminId && !isGateChecked) {
  User.setProperty("fsub_target_cmd", "menu_make_post", "string");
  Bot.runCommand("check_fsub_gate");
  return;
}

var sc = Libs.emojiHelper.sc;

var msg = "<tg-emoji emoji-id='5337310516769467285'>📝</tg-emoji> <b>" + sc("PLEASE SEND YOUR TEXT CONTENT WITH NORMAL Emojis (wo automatic custom emojis me convert ho jayenge):") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html"
});

Bot.run({
  command: "/save_text_content"
});
