/*CMD
  command: /onCtrlAuditResult
  help: Background audit to remove channels where bot is no longer administrator
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var adminId = Bot.getProperty("admin_id") || "8710308658";
var auditChatId = (options && options.bb_options && options.bb_options.audit_chat_id) ? options.bb_options.audit_chat_id : null;
if (!auditChatId) return;

var member = (typeof options !== "undefined" && options && options.result) ? options.result : null;
var ctrlChannels = Bot.getProperty("bot_controlled_channels") || {};

if (!member || member.status !== "administrator") {
  // Bot was removed or is not admin! Purge immediately from list so it is never shown
  if (ctrlChannels[auditChatId]) {
    delete ctrlChannels[auditChatId];
    Bot.setProperty("bot_controlled_channels", ctrlChannels, "json");
  }
} else {
  // Bot confirmed admin: update verified status and fresh permissions
  if (ctrlChannels[auditChatId]) {
    ctrlChannels[auditChatId].is_verified = true;
    ctrlChannels[auditChatId].verified_at = new Date().toISOString();
    ctrlChannels[auditChatId].can_promote_members = !!member.can_promote_members;
    ctrlChannels[auditChatId].can_post_messages = !!member.can_post_messages;
    ctrlChannels[auditChatId].can_edit_messages = !!member.can_edit_messages;
    ctrlChannels[auditChatId].can_delete_messages = !!member.can_delete_messages;
    ctrlChannels[auditChatId].can_invite_users = !!member.can_invite_users;
    ctrlChannels[auditChatId].can_pin_messages = !!member.can_pin_messages;
    ctrlChannels[auditChatId].can_change_info = !!member.can_change_info;
    Bot.setProperty("bot_controlled_channels", ctrlChannels, "json");
  }
}
