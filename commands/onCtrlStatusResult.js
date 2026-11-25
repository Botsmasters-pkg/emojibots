/*CMD
  command: /onCtrlStatusResult
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
var adminId = "8710308658";
if (String(user.telegramid) !== adminId) return;

var cId = User.getProperty("current_ctrl_chat_id");
var member = (typeof options !== "undefined" && options && options.result) ? options.result : null;

var canPromote = member ? !!member.can_promote_members : false;
var canPost = member ? !!member.can_post_messages : false;
var canEdit = member ? !!member.can_edit_messages : false;
var canDelete = member ? !!member.can_delete_messages : false;
var canInvite = member ? !!member.can_invite_users : false;
var canPin = member ? !!member.can_pin_messages : false;
var canChange = member ? !!member.can_change_info : false;

var text = "<tg-emoji emoji-id='4956599758044005301'>🛡️</tg-emoji> <b>" + sc("BOT DETAILED ADMIN PERMISSIONS STATUS:") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
  "🆔 <b>" + sc("Channel ID:") + "</b> <code>" + cId + "</code>\n" +
  "👑 <b>" + sc("Admin Status:") + "</b> " + (member && member.status === "administrator" ? "🟢 Administrator" : "🔴 Not Admin") + "\n\n" +
  "<b>" + sc("Detailed Permissions Checklist:") + "</b>\n" +
  "• " + sc("Add New Admins (can_promote_members):") + " <b>" + (canPromote ? "✅ True" : "❌ False") + "</b>\n" +
  "• " + sc("Post Messages (can_post_messages):") + " <b>" + (canPost ? "✅ True" : "❌ False") + "</b>\n" +
  "• " + sc("Edit Messages (can_edit_messages):") + " <b>" + (canEdit ? "✅ True" : "❌ False") + "</b>\n" +
  "• " + sc("Delete Messages (can_delete_messages):") + " <b>" + (canDelete ? "✅ True" : "❌ False") + "</b>\n" +
  "• " + sc("Invite Users (can_invite_users):") + " <b>" + (canInvite ? "✅ True" : "❌ False") + "</b>\n" +
  "• " + sc("Pin Messages (can_pin_messages):") + " <b>" + (canPin ? "✅ True" : "❌ False") + "</b>\n" +
  "• " + sc("Change Channel Info (can_change_info):") + " <b>" + (canChange ? "✅ True" : "❌ False") + "</b>\n\n" +
  "━━━━━━━━━━━━━━━━━━━━━━";

var markup = {
  inline_keyboard: [
    [
      { text: sc("🔙 BACK TO CHANNEL"), callback_data: "ctrl_ch_" + cId, style: "primary", icon_custom_emoji_id: "5303040006347046717" }
    ]
  ]
};

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: markup
});
