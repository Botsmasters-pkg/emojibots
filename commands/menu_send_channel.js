/*CMD
  command: menu_send_channel
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
  User.setProperty("fsub_target_cmd", "menu_send_channel", "string");
  Bot.runCommand("check_fsub_gate");
  return;
}

var sc = Libs.emojiHelper.sc;

var msg = "<tg-emoji emoji-id='6154659543570714696'>✉</tg-emoji> <b>" + sc("PLEASE ENTER YOUR UNIQUE POST ID TO DISPATCH:") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html"
});

Bot.run({
  command: "/select_channel"
});
