/*CMD
  command: admin_channel_control
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

if (typeof request !== "undefined" && request && request.id) {
  try { Api.answerCallbackQuery({ callback_query_id: request.id }); } catch (e) {}
}

var ctrlChannels = Bot.getProperty("bot_controlled_channels") || {};

// Build buttons list of active channels
var chKeys = Object.keys(ctrlChannels);
var rows = [];
var row = [];

for (var i = 0; i < chKeys.length; i++) {
  var cid = chKeys[i];
  var cObj = ctrlChannels[cid];
  var title = (cObj && cObj.title) ? cObj.title : ("Channel (" + cid.slice(-4) + ")");
  
  row.push({
    text: "📢 " + title,
    callback_data: "ctrl_ch_" + cid,
    style: "primary",
    icon_custom_emoji_id: "6154631793787015439"
  });

  if (row.length === 2) {
    rows.push(row);
    row = [];
  }
}

if (row.length > 0) {
  rows.push(row);
}

// Navigation buttons
rows.push([
  { text: sc("🔄 REFRESH LIST"), callback_data: "admin_channel_control", style: "primary", icon_custom_emoji_id: "5303040006347046717" },
  { text: sc("ADMIN PANEL"), callback_data: "menu_admin_panel", style: "danger", icon_custom_emoji_id: "5870869476408299692" }
]);

var channelCountText = chKeys.length > 0
  ? "<b>" + sc("Connected Channels:") + "</b> <code>" + chKeys.length + "</code>\n\n" + sc("Kisi bhi channel ko manage karne ke liye uske button par click karein:")
  : "<i>" + sc("Filhal koi channel controlled list me nahi hai.") + "</i>\n\n" +
    "💡 <b>" + sc("Yeh kaise kaam karta hai?") + "</b>\n" +
    sc("Aap kisi bhi channel me is bot ko") + " <b>" + sc("Administrator") + "</b> " + sc("banayein, bot automatically yahan jud jayega aur aapko notification aayega!") + "\n\n" +
    "⚠️ <i>" + sc("Agar bot ko kisi channel se hata diya jata hai, to wo automatically yahan se gayab ho jayega.") + "</i>";

var text = "<tg-emoji emoji-id='6154611916678369390'>📡</tg-emoji> <b>" + sc("CHANNEL CONTROL MANAGEMENT PANEL:") + "</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
  channelCountText;

Api.sendMessage({
  chat_id: chat.chatid,
  text: text,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: { inline_keyboard: rows }
});
