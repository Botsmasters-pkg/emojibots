/*CMD
  command: admin_add_channel
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

if (typeof request !== "undefined" && request && request.id) {
  try { Api.answerCallbackQuery({ callback_query_id: request.id }); } catch (e) {}
}

var text = "<tg-emoji emoji-id='6154611916678369390'>👑</tg-emoji> <b>" + sc("SELECT FORCE JOIN CHANNEL TYPE TO ADD:") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
  "🌐 <b>1. " + sc("PUBLIC CHANNEL") + "</b>\n" +
  "• " + sc("Username ya link ke zariye (@channelname)") + "\n\n" +
  "🔒 <b>2. " + sc("PRIVATE CHANNEL") + "</b>\n" +
  "• " + sc("Direct private invite link + Chat ID (-100xxx)") + "\n\n" +
  "📩 <b>3. " + sc("PRIVATE REQUEST CHANNEL") + "</b>\n" +
  "• " + sc("Join Request enabled channel (Approval mode)") + "\n\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n" +
  sc("Neeche diye gaye buttons me se type select karein:");

var markup = {
  inline_keyboard: [
    [
      { text: sc("🌐 PUBLIC CHANNEL"), callback_data: "add_ch_public", style: "primary", icon_custom_emoji_id: "6154631793787015439" }
    ],
    [
      { text: sc("🔒 PRIVATE CHANNEL"), callback_data: "add_ch_private", style: "primary", icon_custom_emoji_id: "5213285132709929474" }
    ],
    [
      { text: sc("📩 PRIVATE REQUEST CHANNEL"), callback_data: "add_ch_request", style: "primary", icon_custom_emoji_id: "6154635564768300782" }
    ],
    [
      { text: sc("STEP BACK"), callback_data: "menu_admin_panel", style: "danger", icon_custom_emoji_id: "5870869476408299692" }
    ]
  ]
};

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  reply_markup: markup
});
