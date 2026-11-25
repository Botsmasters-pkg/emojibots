/*CMD
  command: exec_connect_channels
  help: Action to start channel connection once verified
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var sc = Libs.emojiHelper.sc;
var botUser = Libs.emojiHelper.get_bot_username();

var msg = "<tg-emoji emoji-id='5429651785352501917'>↗️</tg-emoji> <b>" + sc("PLEASE FORWARD A MESSAGE FROM YOUR CHANNEL OR SEND @username:") + "</b>\n\n" +
  "<i>• " + sc("Bot") + " (<code>" + botUser + "</code>) " + sc("ko channel me admin banayein") + "\n" +
  "• " + sc("Aap khud bhi us channel ke Admin/Owner hone chahiye") + "</i>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html"
});

Bot.run({
  command: "/verify_channel"
});
