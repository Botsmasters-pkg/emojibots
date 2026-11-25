/*CMD
  command: exec_send_channel
  help: Action to start channel dispatch once verified
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

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
