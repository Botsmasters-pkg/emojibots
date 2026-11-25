/*CMD
  command: chat_join_request
  help: Telegram Chat Join Request handler
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: /chat_join_request
  group: 
CMD*/

var cjr = null;
if (typeof request !== "undefined" && request) {
  if (typeof request === "string") {
    try {
      var pReq = JSON.parse(request);
      cjr = pReq.chat_join_request || (pReq.update && pReq.update.chat_join_request);
    } catch (e) {}
  } else if (typeof request === "object") {
    cjr = request.chat_join_request;
  }
}
if (!cjr && typeof tgUpdate !== "undefined" && tgUpdate) {
  cjr = tgUpdate.chat_join_request;
}
if (!cjr && typeof options !== "undefined" && options) {
  cjr = options.chat_join_request;
}

if (cjr && cjr.chat && cjr.from) {
  var reqChatId = String(cjr.chat.id);
  var reqUserId = String(cjr.from.id);
  var cleanChatId = reqChatId.replace(/^-100/, "").replace(/^-/, "");
  Bot.setProperty("cjr_" + reqChatId + "_" + reqUserId, true, "boolean");
  Bot.setProperty("cjr_" + cleanChatId + "_" + reqUserId, true, "boolean");
  Bot.setProperty("cjr_-100" + cleanChatId + "_" + reqUserId, true, "boolean");
  if (typeof user !== "undefined" && user && String(user.telegramid) === reqUserId) {
    User.setProperty("cjr_" + reqChatId, true, "boolean");
    User.setProperty("cjr_" + cleanChatId, true, "boolean");
    User.setProperty("cjr_-100" + cleanChatId, true, "boolean");
  }
}
