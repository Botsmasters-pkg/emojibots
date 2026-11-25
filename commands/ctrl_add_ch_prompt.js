/*CMD
  command: ctrl_add_ch_prompt
  help: Prompt admin to connect / add a channel to Channel Control
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
var adminId = Bot.getProperty("admin_id") || "8710308658";
if (String(user.telegramid) !== String(adminId)) return;

if (typeof request !== "undefined" && request && request.id) {
  try { Api.answerCallbackQuery({ callback_query_id: request.id }); } catch (e) {}
}

var botUser = Libs.emojiHelper.get_bot_username();

var promptText = "<tg-emoji emoji-id='6154611916678369390'>📡</tg-emoji> <b>" + sc("ADD CHANNEL TO CHANNEL CONTROL:") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
  "<b>" + sc("Kripya channel ka username, link ya koi post forward karein:") + "</b>\n\n" +
  "• " + sc("Channel username:") + " <code>@mychannel</code>\n" +
  "• " + sc("Channel invite link:") + " <code>https://t.me/mychannel</code>\n" +
  "• " + sc("Private chat ID:") + " <code>-1001234567890</code>\n" +
  "• " + sc("Ya channel se koi bhi post yahan direct") + " <b>" + sc("Forward") + "</b> " + sc("karein.") + "\n\n" +
  "⚠️ <b>" + sc("Note:") + "</b> " + sc("Bot") + " (<code>" + botUser + "</code>) " + sc("us channel me Administrator hona chahiye!");

Api.sendMessage({
  chat_id: chat.chatid,
  text: promptText,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [[
      { text: sc("🔙 CANCEL / BACK"), callback_data: "admin_channel_control", style: "danger", icon_custom_emoji_id: "5870869476408299692" }
    ]]
  }
});

Bot.run({
  command: "/ctrl_process_add_ch"
});
