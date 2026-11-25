/*CMD
  command: chat_member
  help: Telegram Chat Member update handler for real-time leave/kick detection
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: /chat_member
  group: 
CMD*/

var cm = null;
if (typeof request !== "undefined" && request) {
  if (typeof request === "string") {
    try {
      var pCm = JSON.parse(request);
      cm = pCm.chat_member || (pCm.update && pCm.update.chat_member);
    } catch (e) {}
  } else if (typeof request === "object") {
    cm = request.chat_member;
  }
}
if (!cm && typeof tgUpdate !== "undefined" && tgUpdate) {
  cm = tgUpdate.chat_member;
}
if (!cm && typeof options !== "undefined" && options) {
  cm = options.chat_member;
}

if (cm && cm.chat && cm.new_chat_member) {
  var nStatus = cm.new_chat_member.status;
  var cmUserId = String(cm.new_chat_member.user ? cm.new_chat_member.user.id : (cm.from ? cm.from.id : ""));
  var cmChatId = String(cm.chat.id);
  if (nStatus === "left" || nStatus === "kicked" || nStatus === "banned") {
    Bot.setProperty("user_left_" + cmUserId, true, "boolean");
    Bot.setProperty("user_left_ch_" + cmChatId + "_" + cmUserId, true, "boolean");
    Bot.setProperty("fsub_verified_" + cmUserId, false, "boolean");
    Bot.setProperty("fsub_verified_fp_" + cmUserId, "", "string");
  } else if (nStatus === "member" || nStatus === "administrator" || nStatus === "creator") {
    Bot.setProperty("user_left_" + cmUserId, false, "boolean");
    Bot.setProperty("user_left_ch_" + cmChatId + "_" + cmUserId, false, "boolean");
  }
}
