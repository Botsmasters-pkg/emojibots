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

var helper = (typeof Libs !== "undefined" && Libs) ? (Libs.emojiHelper || Libs.EmojiHelper) : null;
var sc = (helper && helper.sc) ? helper.sc : function(s) { return s || ""; };

// Catch Telegram My Chat Member updates (my_chat_member / chat_member)
// Triggered automatically when bot is added as admin or removed from any channel
var mcm = null;
if (typeof request !== "undefined" && request) {
  if (request.my_chat_member) mcm = request.my_chat_member;
  else if (request.chat_member) mcm = request.chat_member;
  else if (typeof request === "string") {
    try {
      var parsedReq = JSON.parse(request);
      if (parsedReq.my_chat_member) mcm = parsedReq.my_chat_member;
      else if (parsedReq.chat_member) mcm = parsedReq.chat_member;
    } catch (e) {}
  }
}
if (!mcm && typeof tgUpdate !== "undefined" && tgUpdate) {
  if (tgUpdate.my_chat_member) mcm = tgUpdate.my_chat_member;
  else if (tgUpdate.chat_member) mcm = tgUpdate.chat_member;
}
if (!mcm && typeof options !== "undefined" && options) {
  if (options.my_chat_member) mcm = options.my_chat_member;
  else if (options.chat_member) mcm = options.chat_member;
}

if (mcm && mcm.chat && mcm.new_chat_member) {
  var cChat = mcm.chat;
  var cNew = mcm.new_chat_member;
  var cId = String(cChat.id);
  var cTitle = cChat.title || cChat.username || ("Channel (" + cId.slice(-4) + ")");
  var cUser = mcm.from;
  var cUsername = cChat.username ? ("@" + cChat.username) : "";
  var cLink = cUsername ? ("https://t.me/" + cChat.username) : ("https://t.me/c/" + cId.replace(/^-100/, ""));
  var ADMIN_ID = Bot.getProperty("admin_id") || "8710308658";

  var ctrlChannels = Bot.getProperty("bot_controlled_channels") || {};

  if (cNew.status === "administrator") {
    ctrlChannels[cId] = {
      id: cId,
      title: cTitle,
      username: cUsername,
      link: cLink,
      can_promote_members: !!cNew.can_promote_members,
      can_post_messages: !!cNew.can_post_messages,
      can_edit_messages: !!cNew.can_edit_messages,
      can_delete_messages: !!cNew.can_delete_messages,
      can_invite_users: !!cNew.can_invite_users,
      can_pin_messages: !!cNew.can_pin_messages,
      can_change_info: !!cNew.can_change_info,
      updated_at: new Date().toISOString()
    };
    Bot.setProperty("bot_controlled_channels", ctrlChannels, "json");

    var adminName = cUser ? (cUser.first_name ? cUser.first_name : (cUser.username ? "@" + cUser.username : "User")) : "Admin";
    var adminNotice = "<tg-emoji emoji-id='6154611916678369390'>👑</tg-emoji> <b>" + sc("BOT PROMOTED AS ADMIN IN CHANNEL!") + "</b>\n" +
                      "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                      "📢 <b>" + sc("Channel:") + "</b> <a href=\"" + cLink + "\">" + cTitle + "</a>\n" +
                      "🆔 <b>" + sc("Chat ID:") + "</b> <code>" + cId + "</code>\n" +
                      "👤 <b>" + sc("Added By:") + "</b> " + adminName + " (<code>" + (cUser ? cUser.id : "") + "</code>)\n" +
                      "🔑 <b>" + sc("Add New Admins Right:") + "</b> " + (cNew.can_promote_members ? "✅ True" : "❌ False") + "\n\n" +
                      "━━━━━━━━━━━━━━━━━━━━━━\n" +
                      "👉 <i>" + sc("Aap ise Admin Panel ➡️ Channel Control se manage kar sakte hain.") + "</i>";

    try {
      Api.sendMessage({
        chat_id: ADMIN_ID,
        text: adminNotice,
        parse_mode: "html",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [[
            { text: sc("⚙️ MANAGE CHANNEL"), callback_data: "ctrl_ch_" + cId, style: "primary", icon_custom_emoji_id: "6154631793787015439" }
          ]]
        }
      });
    } catch (e) {}
  } else {
    // If bot was removed or demoted from admin, immediately remove from Channel Control so it does NOT show
    if (ctrlChannels[cId]) {
      delete ctrlChannels[cId];
      Bot.setProperty("bot_controlled_channels", ctrlChannels, "json");
    }
  }
  return;
}

// Catch Telegram Chat Join Requests (chat_join_request)
// Even if request is pending, save it so user is automatically approved/verified!
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
  return;
}

// Catch Telegram Chat Member Updates (chat_member)
// When a user leaves or is kicked from a required channel, mark them as left!
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

// Check waiting clone email or clone command trigger
if (typeof user !== "undefined" && user) {
  var uIdStr = String(user.telegramid);
  var uMap = Bot.getProperty("users_map") || {};
  if (!uMap[uIdStr] || (user.username && !uMap[uIdStr].username)) {
    uMap[uIdStr] = {
      id: user.telegramid,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      username: user.username || "",
      joined_at: (uMap[uIdStr] && uMap[uIdStr].joined_at) ? uMap[uIdStr].joined_at : new Date().toISOString()
    };
    Bot.setProperty("users_map", uMap, "json");
  }

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
  // Always answer callback queries immediately to prevent Telegram client timeout / loading spinner
  if (typeof request !== "undefined" && request && request.id) {
    try {
      Api.answerCallbackQuery({ callback_query_id: request.id });
    } catch (e) {}
  }

  // Handle Admin User Explorer pagination & CSV export
  if (cbData === "admin_export_users" || cbData.indexOf("admin_users_page_") === 0) {
    var pNum = cbData.replace("admin_users_page_", "").replace("admin_export_users", "1");
    Bot.runCommand("admin_export_users " + pNum);
    return;
  }

  if (cbData === "admin_export_csv") {
    Bot.runCommand("admin_export_csv");
    return;
  }

  // Handle Bot Token Sync callback
  if (cbData === "sync_bot_identity") {
    Bot.runCommand("sync_bot_identity");
    return;
  }

  // Handle Channel Control callbacks
  if (cbData === "admin_channel_control") {
    Bot.runCommand("admin_channel_control");
    return;
  }

  if (cbData === "ctrl_add_ch_prompt") {
    Bot.runCommand("ctrl_add_ch_prompt");
    return;
  }

  if (cbData.indexOf("ctrl_ch_") === 0) {
    Bot.runCommand("ctrl_channel_view " + cbData.replace("ctrl_ch_", ""));
    return;
  }

  if (cbData.indexOf("ctrl_act_") === 0) {
    Bot.runCommand(cbData);
    return;
  }

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
