/*CMD
  command: /onCtrlAddChVerify
  help: Callback verifying bot admin rights when adding channel to Channel Control
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: 
  group: 
CMD*/

var sc = Libs.emojiHelper.sc;
var adminId = Bot.getProperty("admin_id") || "8710308658";
if (String(user.telegramid) !== String(adminId)) return;

var target = User.getProperty("adding_ctrl_target");
var targetTitle = User.getProperty("adding_ctrl_title") || target;
var member = (typeof options !== "undefined" && options && options.result) ? options.result : null;

if (!member || member.status !== "administrator") {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>" + sc("VERIFICATION FAILED!") + "</b>\n\n" +
      sc("Bot is channel (") + "<code>" + target + "</code>" + sc(") me Administrator nahi hai!") + "\n\n" +
      "<i>" + sc("Pehle bot ko channel me Admin banayein, phir dobara try karein.") + "</i>",
    parse_mode: "html",
    reply_markup: {
      inline_keyboard: [[
        { text: sc("🔄 TRY AGAIN"), callback_data: "ctrl_add_ch_prompt", style: "success", icon_custom_emoji_id: "6154718341672997377" },
        { text: sc("🔙 CHANNELS LIST"), callback_data: "admin_channel_control", style: "primary", icon_custom_emoji_id: "5303040006347046717" }
      ]]
    }
  });
  return;
}

// Bot is confirmed administrator! Save to bot_controlled_channels
var ctrlChannels = Bot.getProperty("bot_controlled_channels") || {};
var cleanId = String(target);
var isUname = cleanId.indexOf("@") === 0;
var cLink = isUname ? ("https://t.me/" + cleanId.replace("@", "")) : ("https://t.me/c/" + cleanId.replace(/^-100/, ""));

ctrlChannels[cleanId] = {
  id: cleanId,
  title: targetTitle || cleanId,
  username: isUname ? cleanId : "",
  link: cLink,
  can_promote_members: !!member.can_promote_members,
  can_post_messages: !!member.can_post_messages,
  can_edit_messages: !!member.can_edit_messages,
  can_delete_messages: !!member.can_delete_messages,
  can_invite_users: !!member.can_invite_users,
  can_pin_messages: !!member.can_pin_messages,
  can_change_info: !!member.can_change_info,
  updated_at: new Date().toISOString()
};
Bot.setProperty("bot_controlled_channels", ctrlChannels, "json");

// Also add to user_channels
var userChannels = Bot.getProperty("user_channels") || {};
var ulist = userChannels[user.telegramid] || [];
var exists = false;
for (var i = 0; i < ulist.length; i++) {
  if (String(ulist[i].id) === cleanId) { exists = true; break; }
}
if (!exists) {
  ulist.push({ id: cleanId, title: targetTitle });
  userChannels[user.telegramid] = ulist;
  Bot.setProperty("user_channels", userChannels, "json");
}

var successText = "<tg-emoji emoji-id='6154611916678369390'>👑</tg-emoji> <b>" + sc("CHANNEL SUCCESSFULLY CONNECTED TO CHANNEL CONTROL!") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
  "📢 <b>" + sc("Channel:") + "</b> <b>" + targetTitle + "</b> (<code>" + cleanId + "</code>)\n" +
  "🔑 <b>" + sc("Add New Admins:") + "</b> " + (member.can_promote_members ? "✅ True" : "❌ False") + "\n" +
  "✉️ <b>" + sc("Post Messages:") + "</b> " + (member.can_post_messages ? "✅ True" : "❌ False") + "\n\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n" +
  "<i>" + sc("Aap ise ab direct Channel Control se manage kar sakte hain.") + "</i>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: successText,
  parse_mode: "html",
  reply_markup: {
    inline_keyboard: [
      [
        { text: sc("⚙️ MANAGE CHANNEL"), callback_data: "ctrl_ch_" + cleanId, style: "primary", icon_custom_emoji_id: "6154631793787015439" }
      ],
      [
        { text: sc("🔙 CHANNELS LIST"), callback_data: "admin_channel_control", style: "success", icon_custom_emoji_id: "5303040006347046717" }
      ]
    ]
  }
});
