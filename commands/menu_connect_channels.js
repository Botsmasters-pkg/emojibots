/*CMD
  command: menu_connect_channels
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

var msg = "<tg-emoji emoji-id='5429651785352501917'>↗️</tg-emoji> <b>" + sc("PLEASE FORWARD A MESSAGE FROM YOUR CHANNEL OR SEND @username:") + "</b>\n\n" +
  "<i>• " + sc("Bot ko channel me admin banayein") + "\n" +
  "• " + sc("Aap khud bhi us channel ke Admin/Owner hone chahiye") + "</i>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: msg,
  parse_mode: "html"
});

Bot.run({
  command: "/verify_channel"
});