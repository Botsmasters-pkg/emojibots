/*CMD
  command: *
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

// Catch Telegram Chat Join Requests (chat_join_request)
if (typeof request !== "undefined" && request && request.chat_join_request) {
  var cjr = request.chat_join_request;
  if (cjr && cjr.chat && cjr.from) {
    var reqChatId = String(cjr.chat.id);
    var reqUserId = String(cjr.from.id);
    Bot.setProperty("cjr_" + reqChatId + "_" + reqUserId, true, "boolean");
  }
  return;
}

// Check waiting clone email or clone command trigger
if (typeof user !== "undefined" && user) {
  var isWaitingEmail = Bot.getProperty("waiting_clone_email_" + user.telegramid);
  var msgText = (typeof message === "string") ? message.trim() : "";
  if (isWaitingEmail || (msgText && (msgText.indexOf("/41") === 0 || msgText.indexOf("41") === 0))) {
    Bot.runCommand("/41 " + msgText);
    return;
  }
}

// Extract callback_data safely as string
var cbData = null;
if (typeof request !== "undefined" && request && typeof request.data === "string") {
  cbData = request.data;
} else if (typeof params === "string" && params) {
  cbData = params;
}

if (typeof cbData === "string") {
  // Handle channel addition callbacks
  if (cbData === "add_ch_public" || cbData === "add_ch_private" || cbData === "add_ch_request") {
    Bot.runCommand(cbData);
    return;
  }

  // Handle color selection callback routing
  if (cbData.indexOf("color_") === 0) {
    Bot.runCommand(cbData);
    return;
  }

  // Handle finalize post callbacks
  if (cbData === "btn_done" || cbData === "more_btn_no") {
    Bot.runCommand("/finalize_post");
    return;
  }

  // Handle add more button callback
  if (cbData === "more_btn_yes") {
    Bot.runCommand("/ask_for_buttons");
    return;
  }

  // Handle skip button callback
  if (cbData === "btn_skip") {
    Bot.runCommand("btn_skip");
    return;
  }

  // Handle send to channel
  if (cbData.indexOf("send_") === 0) {
    if (typeof request !== "undefined" && request && request.id) {
      try {
        Api.answerCallbackQuery({ callback_query_id: request.id });
      } catch (e) {}
    }

    var parts = cbData.split("_");
    if (parts.length >= 3) {
      var pid = parts[1];
      var cid = parts.slice(2).join("_");
      
      User.setProperty("exec_pid", pid, "string");
      User.setProperty("exec_cid", cid, "string");
      
      Api.getChatMember({
        chat_id: cid,
        user_id: user.telegramid,
        on_result: "/onVerifySendChannel",
        on_error: "/onVerifySendChannel"
      });
    }
    return;
  }
}
