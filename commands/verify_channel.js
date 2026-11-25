/*CMD
  command: /verify_channel
  help: 
  need_reply: true
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var helper = (typeof Libs !== "undefined" && Libs) ? (Libs.emojiHelper || Libs.EmojiHelper) : null;
var sc = (helper && helper.sc) ? helper.sc : function(s) { return s || ""; };

var target = null;
if (request && request.forward_from_chat && request.forward_from_chat.type === "channel") {
  target = request.forward_from_chat.id;
} else if (message) {
  target = message.trim();
}

if (!target) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>" + sc("PLEASE FORWARD A MESSAGE OR SEND A VALID CHANNEL USERNAME.") + "</b>",
    parse_mode: "html"
  });
  return;
}

User.setProperty("verifying_chat_id", target, "string");

Api.getChatMember({
  chat_id: target,
  user_id: user.telegramid,
  on_result: "/onVerifyChannelUser",
  on_error: "/onVerifyChannelError"
});