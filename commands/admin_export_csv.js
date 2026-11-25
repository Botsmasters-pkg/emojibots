/*CMD
  command: admin_export_csv
  help: Generate and export all registered users in CSV format
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
  try {
    Api.answerCallbackQuery({
      callback_query_id: request.id,
      text: "⏳ Generating CSV Export..."
    });
  } catch (e) {}
}

var users = Bot.getProperty("users") || [];
var usersMap = Bot.getProperty("users_map") || {};

if (users.length === 0) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: "<tg-emoji emoji-id='5870869476408299692'>⚠️</tg-emoji> <b>" + sc("Koi bhi user data export karne ke liye maujood nahi hai.") + "</b>",
    parse_mode: "html",
    reply_markup: {
      inline_keyboard: [[
        { text: sc("🔙 BACK TO USERS"), callback_data: "admin_export_users", style: "primary", icon_custom_emoji_id: "5303040006347046717" }
      ]]
    }
  });
  return;
}

// Generate CSV data rows
var csvHeader = "Index,User ID,First Name,Last Name,Username,Direct Profile Link,Registered Date\n";
var csvRows = "";

for (var i = 0; i < users.length; i++) {
  var uid = users[i];
  var u = usersMap[uid] || {};
  var fn = (u.first_name || "").replace(/"/g, '""');
  var ln = (u.last_name || "").replace(/"/g, '""');
  var un = u.username ? ("@" + u.username) : "";
  var link = u.username ? ("https://t.me/" + u.username) : ("tg://user?id=" + uid);
  var dt = u.joined_at || "";

  csvRows += (i + 1) + ',"' + uid + '","' + fn + '","' + ln + '","' + un + '","' + link + '","' + dt + '"\n';
}

var fullCsv = csvHeader + csvRows;

var caption = "<tg-emoji emoji-id='6154659543570714696'>📥</tg-emoji> <b>" + sc("USERS DATABASE CSV EXPORT COMPLETE") + "</b>\n" +
              "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
              "👥 <b>" + sc("Total Exported Users:") + "</b> <code>" + users.length + "</code>\n" +
              "📅 <b>" + sc("Generated At:") + "</b> <code>" + new Date().toISOString().replace("T", " ").substr(0, 19) + " UTC</code>\n\n" +
              "━━━━━━━━━━━━━━━━━━━━━━\n" +
              "👇 <b>" + sc("CSV Data (Copyable):") + "</b>\n\n" +
              "<pre>" + (fullCsv.length > 3000 ? (fullCsv.substring(0, 3000) + "\n...[truncated for message length]") : fullCsv) + "</pre>\n\n" +
              "━━━━━━━━━━━━━━━━━━━━━━\n" +
              "💡 <i>" + sc("Upar diye gaye data ko aap directly copy karke .csv file (Excel ya Google Sheets) me open kar sakte hain.") + "</i>";

Api.sendMessage({
  chat_id: chat.chatid,
  text: caption,
  parse_mode: "html",
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [
      [
        { text: sc("👥 BACK TO USERS LIST"), callback_data: "admin_export_users", style: "primary", icon_custom_emoji_id: "5303040006347046717" },
        { text: sc("👑 ADMIN PANEL"), callback_data: "menu_admin_panel", style: "danger", icon_custom_emoji_id: "6154611916678369390" }
      ]
    ]
  }
});
