/*CMD
  command: /onCtrlAuditResult
  help: Live audit callback to ensure bot_controlled_channels only has active admin channels
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
var auditChatId = (options && options.bb_options && options.bb_options.audit_chat_id) ? String(options.bb_options.audit_chat_id) : null;
if (!auditChatId) return;

var auditTitle = (options && options.bb_options && options.bb_options.audit_title) ? options.bb_options.audit_title : null;
var member = (typeof options !== "undefined" && options && options.result) ? options.result : null;
var ctrlChannels = Bot.getProperty("bot_controlled_channels") || {};

var isAdmin = member && (member.status === "administrator" || member.status === "creator");

if (isAdmin) {
  // Bot IS confirmed administrator in this channel! Keep / restore in bot_controlled_channels
  if (!ctrlChannels[auditChatId]) {
    ctrlChannels[auditChatId] = { id: auditChatId };
  }
  if (auditTitle && !ctrlChannels[auditChatId].title) {
    ctrlChannels[auditChatId].title = auditTitle;
  }
  ctrlChannels[auditChatId].can_promote_members = !!member.can_promote_members;
  ctrlChannels[auditChatId].can_post_messages = !!member.can_post_messages;
  ctrlChannels[auditChatId].can_edit_messages = !!member.can_edit_messages;
  ctrlChannels[auditChatId].can_delete_messages = !!member.can_delete_messages;
  ctrlChannels[auditChatId].can_invite_users = !!member.can_invite_users;
  ctrlChannels[auditChatId].can_pin_messages = !!member.can_pin_messages;
  ctrlChannels[auditChatId].can_change_info = !!member.can_change_info;
  ctrlChannels[auditChatId].updated_at = new Date().toISOString();
  Bot.setProperty("bot_controlled_channels", ctrlChannels, "json");
} else {
  // Bot is NOT admin in this channel (or kicked/demoted/left/error)! Remove immediately
  if (ctrlChannels[auditChatId]) {
    delete ctrlChannels[auditChatId];
    Bot.setProperty("bot_controlled_channels", ctrlChannels, "json");
  }
}
