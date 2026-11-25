/*CMD
  command: /onCtrlVerifyBotAdmin
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

var targetChatId = User.getProperty("current_ctrl_chat_id");
var member = (typeof options !== "undefined" && options && options.result) ? options.result : null;
var ctrlChannels = Bot.getProperty("bot_controlled_channels") || {};

if (!member || member.status !== "administrator") {
  // Do NOT delete channel! Only admin has the right to remove channels.
  var notAdminAlert = "<tg-emoji emoji-id='5870869476408299692'>⚠️</tg-emoji> <b>" + sc("BOT IS CURRENTLY NOT ADMIN IN THIS CHANNEL") + "</b>\n\n" +
                      sc("Bot ke paas is channel me admin permissions nahi hain. Channel ko list se nahi hataya gaya hai kyunki channel sirf admin hi remove kar sakta hai.");
  Api.sendMessage({
    chat_id: chat.chatid,
    text: notAdminAlert,
    parse_mode: "html",
    reply_markup: {
      inline_keyboard: [
        [
          { text: sc("🔄 RE-VERIFY ADMIN"), callback_data: "ctrl_ch_" + targetChatId, style: "primary", icon_custom_emoji_id: "5303040006347046717" }
        ],
        [
          { text: sc("🔙 BACK TO CHANNELS"), callback_data: "admin_channel_control", style: "primary", icon_custom_emoji_id: "5303040006347046717" }
        ]
      ]
    }
  });
  return;
}

// Bot is confirmed admin! Update latest permissions in cache
var canPromote = !!member.can_promote_members;
var canPost = !!member.can_post_messages;
var canEdit = !!member.can_edit_messages;
var canDelete = !!member.can_delete_messages;
var canInvite = !!member.can_invite_users;
var canPin = !!member.can_pin_messages;
var canChange = !!member.can_change_info;

if (!ctrlChannels[targetChatId]) {
  ctrlChannels[targetChatId] = { id: targetChatId };
}
ctrlChannels[targetChatId].can_promote_members = canPromote;
ctrlChannels[targetChatId].can_post_messages = canPost;
ctrlChannels[targetChatId].can_edit_messages = canEdit;
ctrlChannels[targetChatId].can_delete_messages = canDelete;
ctrlChannels[targetChatId].can_invite_users = canInvite;
ctrlChannels[targetChatId].can_pin_messages = canPin;
ctrlChannels[targetChatId].can_change_info = canChange;
Bot.setProperty("bot_controlled_channels", ctrlChannels, "json");

var cObj = ctrlChannels[targetChatId] || {};
var title = cObj.title || ("Channel (" + targetChatId.slice(-4) + ")");
var link = cObj.link || ("https://t.me/c/" + targetChatId.replace(/^-100/, ""));

var text = "<tg-emoji emoji-id='6154611916678369390'>👑</tg-emoji> <b>" + sc("CHANNEL CONTROL DASHBOARD") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
  "📢 <b>" + sc("Channel:") + "</b> <a href=\"" + link + "\">" + title + "</a>\n" +
  "🆔 <b>" + sc("Chat ID:") + "</b> <code>" + targetChatId + "</code>\n\n" +
  "🛡️ <b>" + sc("BOT PERMISSIONS STATUS:") + "</b>\n" +
  "• " + sc("Add New Admins:") + " <b>" + (canPromote ? "✅ True" : "❌ False") + "</b>\n" +
  "• " + sc("Post Messages:") + " <b>" + (canPost ? "✅ True" : "❌ False") + "</b>\n" +
  "• " + sc("Delete Messages:") + " <b>" + (canDelete ? "✅ True" : "❌ False") + "</b>\n" +
  "• " + sc("Edit Messages:") + " <b>" + (canEdit ? "✅ True" : "❌ False") + "</b>\n" +
  "• " + sc("Invite Users:") + " <b>" + (canInvite ? "✅ True" : "❌ False") + "</b>\n\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n" +
  sc("Neeche diye gaye options se action select karein:");

var markup = {
  inline_keyboard: [
    [
      { text: sc("🔗 GET LINK"), callback_data: "ctrl_act_link", style: "primary", icon_custom_emoji_id: "6154729229415093721" },
      { text: sc("🛡️ STATUS"), callback_data: "ctrl_act_status", style: "primary", icon_custom_emoji_id: "4956599758044005301" }
    ],
    [
      { text: sc("⬆️ PROMOTE USER"), callback_data: "ctrl_act_promote", style: "success", icon_custom_emoji_id: "6154718341672997377" },
      { text: sc("⬇️ DEMOTE ADMIN"), callback_data: "ctrl_act_demote", style: "danger", icon_custom_emoji_id: "5870869476408299692" }
    ],
    [
      { text: sc("✉️ SEND MESSAGE"), callback_data: "ctrl_act_send", style: "success", icon_custom_emoji_id: "6154631793787015439" },
      { text: sc("🗑️ DELETE MESSAGE"), callback_data: "ctrl_act_delete", style: "danger", icon_custom_emoji_id: "5870869476408299692" }
    ],
    [
      { text: sc("🔙 BACK TO CHANNELS"), callback_data: "admin_channel_control", style: "primary", icon_custom_emoji_id: "5303040006347046717" }
    ]
  ]
};

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: markup
});
