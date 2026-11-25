/*CMD
  command: sync_bot_identity
  help: Manually trigger Telegram Bot API getMe to sync bot identity from token
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: /sync_bot, /sync_token
  group: 
CMD*/

var helper = (typeof Libs !== "undefined" && Libs) ? (Libs.emojiHelper || Libs.EmojiHelper) : null;
var sc = (helper && helper.sc) ? helper.sc : function(s) { return s || ""; };
var adminId = "8710308658";
if (String(user.telegramid) !== adminId) return;

if (typeof request !== "undefined" && request && request.id) {
  try { Api.answerCallbackQuery({ callback_query_id: request.id, text: "Syncing bot token..." }); } catch (e) {}
}

Api.getMe({
  on_result: "/onSyncBotIdentityDone",
  on_error: "/onSyncBotIdentityDone"
});

Api.getWebhookInfo({
  on_result: "/onEnsureWebhookAllowedUpdates",
  on_error: "/onEnsureWebhookAllowedUpdates"
});
