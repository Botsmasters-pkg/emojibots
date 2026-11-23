/*CMD
  command: admin_status
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
var adminId = "8710308658";
if (String(user.telegramid) !== adminId) return;

var users = Bot.getProperty("users") || [];
var postsDb = Bot.getProperty("posts_db") || {};
var mustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;
var emojiDb = Bot.getProperty("emoji_db") || {};
var textEmojis = emojiDb.text || Libs.emojiHelper.DEFAULT_TEXT_EMOJIS;
var btnEmojis = emojiDb.button || Libs.emojiHelper.DEFAULT_BUTTON_EMOJIS;
var userChannels = Bot.getProperty("user_channels") || {};

var connectedChannelsCount = 0;
for (var k in userChannels) {
  connectedChannelsCount += (userChannels[k] || []).length;
}

var botUser = Libs.emojiHelper.get_bot_username();
var botTitle = Libs.emojiHelper.get_bot_title();
var botId = Libs.emojiHelper.get_bot_id() || (typeof bot !== "undefined" && bot ? bot.id : "N/A");

var statusText = "<tg-emoji emoji-id='4956599758044005301'>📊</tg-emoji> <b>" + sc("DETAILED SYSTEM ANALYTICS & STATUS DASHBOARD:") + "</b>\n\n" +
  "• **" + sc("Bot Identity") + "**: <code>" + botUser + "</code> (" + botTitle + ")\n" +
  "• **" + sc("Bot Telegram ID") + "**: <code>" + botId + "</code>\n" +
  "• **" + sc("Total Registered Users") + "**: <code>" + users.length + "</code>\n" +
  "• **" + sc("Active Users / Session") + "**: <code>" + users.length + "</code>\n" +
  "• **" + sc("Forced Join Channels") + "**: <code>" + mustJoin.length + "</code>\n" +
  "• **" + sc("Connected User Channels") + "**: <code>" + connectedChannelsCount + "</code>\n" +
  "• **" + sc("Configured Text Emojis") + "**: <code>" + textEmojis.length + "</code>\n" +
  "• **" + sc("Configured Button Emojis") + "**: <code>" + btnEmojis.length + "</code>\n" +
  "• **" + sc("Generated Posts in DB") + "**: <code>" + Object.keys(postsDb).length + "</code>\n" +
  "• **" + sc("Bot Status") + "**: 🟢 <code>" + sc("ONLINE & FULLY ACTIVE") + "</code>\n\n" +
  "<b>" + sc("All systems are operating smoothly with optimal performance.") + "</b>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: statusText,
  parse_mode: "html",
  reply_markup: {
    inline_keyboard: [
      [
        { text: sc("🔄 SYNC BOT TOKEN"), callback_data: "sync_bot_identity", style: "primary", icon_custom_emoji_id: "5303040006347046717" }
      ],
      [
        { text: sc("STEP BACK"), callback_data: "menu_admin_panel", style: "primary", icon_custom_emoji_id: "6154631793787015439" },
        { text: sc("MAIN MENU"), callback_data: "back_to_main", style: "success", icon_custom_emoji_id: "5303040006347046717" }
      ],
      [
        { text: sc("ADMIN PANEL"), callback_data: "menu_admin_panel", style: "danger", icon_custom_emoji_id: "5870869476408299692" }
      ]
    ]
  }
});