/*CMD
  command: confirm_join_request
  help: Fallback button for users who submitted a channel join request
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var sc = Libs.emojiHelper.sc;

if (typeof request !== "undefined" && request && request.id) {
  try {
    Api.answerCallbackQuery({
      callback_query_id: request.id,
      text: sc("Request marked! Checking all channels now..."),
      show_alert: false
    });
  } catch (e) {}
}

User.setProperty("cjr_self_verified", true, "boolean");

var rawMustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
for (var i = 0; i < rawMustJoin.length; i++) {
  var norm = Libs.emojiHelper.normalizeChannel(rawMustJoin[i]);
  if (norm && norm.type === "request") {
    var cId = String(norm.id);
    var cleanCId = cId.replace(/^-100/, "").replace(/^-/, "");
    Bot.setProperty("cjr_" + cId + "_" + user.telegramid, true, "boolean");
    Bot.setProperty("cjr_" + cleanCId + "_" + user.telegramid, true, "boolean");
    Bot.setProperty("cjr_-100" + cleanCId + "_" + user.telegramid, true, "boolean");
    User.setProperty("cjr_" + cId, true, "boolean");
    User.setProperty("cjr_" + cleanCId, true, "boolean");
    User.setProperty("cjr_-100" + cleanCId, true, "boolean");
  }
}

Bot.runCommand("check_join");
