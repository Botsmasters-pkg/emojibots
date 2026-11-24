/*CMD
  command: /onEnsureWebhookAllowedUpdates
  help: Ensure Telegram webhook allowed_updates includes my_chat_member
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

if (options && options.result && options.result.url) {
  var webhookUrl = options.result.url;
  var allowed = options.result.allowed_updates || [];
  if (allowed.indexOf("my_chat_member") === -1 || allowed.indexOf("chat_member") === -1) {
    Api.setWebhook({
      url: webhookUrl,
      allowed_updates: [
        "message",
        "edited_message",
        "channel_post",
        "edited_channel_post",
        "callback_query",
        "chat_join_request",
        "my_chat_member",
        "chat_member"
      ]
    });
  }
}
