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
var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var hasChannels = rawMustJoin && rawMustJoin.length > 0;
var isVerified = User.getProperty("fsub_verified");
var userLeft = Bot.getProperty("user_left_" + user.telegramid);

if (String(user.telegramid) !== adminId && hasChannels && (!isVerified || userLeft)) {
  Bot.runCommand("show_force_join");
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
