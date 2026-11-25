/*CMD
  command: /ctrl_process_add_ch
  help: Process channel username, link, or forwarded post to add to Channel Control
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
var adminId = Bot.getProperty("admin_id") || "8710308658";
if (String(user.telegramid) !== String(adminId)) return;

if (typeof message === "string" && (message === "/start" || message === "/cancel" || message === "/admin")) {
  Bot.runCommand(message === "/cancel" ? "admin_channel_control" : message);
  return;
}

var target = null;
var targetTitle = null;

// 1. Check if forwarded from channel
if (typeof request !== "undefined" && request && request.forward_from_chat) {
  target = String(request.forward_from_chat.id);
  targetTitle = request.forward_from_chat.title || request.forward_from_chat.username || target;
} else if (typeof message === "string" && message) {
  var raw = message.trim();
  if (raw.indexOf("http") === 0) {
    target = raw.replace(/^https?:\/\/t\.me\//, "").replace(/\/$/, "");
    if (target.indexOf("+") === -1 && target.indexOf("joinchat") === -1 && target.indexOf("c/") === -1) {
      target = "@" + target;
    }
  } else if (raw.indexOf("-100") === 0 || raw.indexOf("-") === 0) {
    target = raw;
  } else if (raw.indexOf("@") === 0) {
    target = raw;
  } else {
    target = "@" + raw;
  }
  targetTitle = target;
}

if (!target) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("INVALID INPUT!") + "</b>\n\n" + sc("Kripya valid channel username ya forward post bhejein."),
    parse_mode: "html",
    reply_markup: {
      inline_keyboard: [[
        { text: sc("🔙 CANCEL / BACK"), callback_data: "admin_channel_control", style: "danger", icon_custom_emoji_id: "5870869476408299692" }
      ]]
    }
  });
  return;
}

User.setProperty("adding_ctrl_target", target, "string");
User.setProperty("adding_ctrl_title", targetTitle, "string");

var botTgId = Libs.emojiHelper.get_bot_id() || bot.id;
Api.getChatMember({
  chat_id: target,
  user_id: botTgId,
  on_result: "/onCtrlAddChVerify",
  on_error: "/onCtrlAddChVerify"
});
