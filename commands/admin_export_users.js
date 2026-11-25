/*CMD
  command: admin_export_users
  help: Paginated users explorer with direct clickable profiles and CSV export
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

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

var users = Bot.getProperty("users") || [];
var usersMap = Bot.getProperty("users_map") || {};
var totalUsers = users.length;
var pageSize = 10;
var totalPages = Math.ceil(totalUsers / pageSize) || 1;

var pageParam = (typeof params === "string" && params) ? params.trim() : "1";
var currentPage = parseInt(pageParam, 10);
if (isNaN(currentPage) || currentPage < 1) currentPage = 1;
if (currentPage > totalPages) currentPage = totalPages;

var startIdx = (currentPage - 1) * pageSize;
var endIdx = Math.min(startIdx + pageSize, totalUsers);

var text = "<tg-emoji emoji-id='6154659543570714696'>📊</tg-emoji> <b>" + sc("REGISTERED USERS DIRECTORY") + "</b>\n" +
           "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
           "👥 <b>" + sc("Total Bot Users:") + "</b> <code>" + totalUsers + "</code>\n" +
           "📄 <b>" + sc("Page:") + "</b> <code>" + currentPage + " / " + totalPages + "</code> (Showing " + (totalUsers > 0 ? (startIdx + 1) : 0) + " - " + endIdx + ")\n\n" +
           "━━━━━━━━━━━━━━━━━━━━━━\n\n";

if (totalUsers === 0) {
  text += "<i>" + sc("Abhi koi user registered nahi hai.") + "</i>\n\n";
} else {
  for (var i = startIdx; i < endIdx; i++) {
    var uid = users[i];
    var uInfo = usersMap[uid] || {};
    var fName = uInfo.first_name || "";
    var lName = uInfo.last_name || "";
    var fullName = (fName + " " + lName).trim() || ("User " + uid);
    var directChatUrl = "tg://user?id=" + uid;
    var tmeUrl = uInfo.username ? ("https://t.me/" + uInfo.username) : directChatUrl;
    var usernameDisplay = uInfo.username ? ("<a href=\"" + tmeUrl + "\">@" + uInfo.username + "</a>") : "<i>" + sc("None") + "</i>";

    text += "<b>" + (i + 1) + ".</b> 👤 <a href=\"" + directChatUrl + "\"><b>" + escapeHtml(fullName) + "</b></a>\n" +
            "   ├ 🔗 <b>" + sc("Username:") + "</b> " + usernameDisplay + "\n" +
            "   └ 🆔 <b>" + sc("ID:") + "</b> <code>" + uid + "</code> • <a href=\"" + directChatUrl + "\"><b>[ " + sc("MESSAGE") + " 💬 ]</b></a>\n\n";
  }
}

text += "━━━━━━━━━━━━━━━━━━━━━━\n" +
        "👉 <i>" + sc("Kisi bhi user ke Name, Username ya [ MESSAGE ] link par tap karke aap direct chat kar sakte hain.") + "</i>";

var inlineKeyboard = [];

// Row 1: Pagination Navigation (10 users per page)
var navRow = [];
if (currentPage > 1) {
  navRow.push({
    text: sc("⬅️ PREV"),
    callback_data: "admin_users_page_" + (currentPage - 1),
    style: "primary",
    icon_custom_emoji_id: "5303040006347046717"
  });
}
navRow.push({
  text: sc("📄 " + currentPage + " / " + totalPages),
  callback_data: "admin_users_page_" + currentPage,
  style: "primary"
});
if (currentPage < totalPages) {
  navRow.push({
    text: sc("NEXT ➡️"),
    callback_data: "admin_users_page_" + (currentPage + 1),
    style: "primary",
    icon_custom_emoji_id: "5303040006347046717"
  });
}
inlineKeyboard.push(navRow);

// Row 2: CSV Export Button (right below next/prev pagination!)
inlineKeyboard.push([
  {
    text: sc("📥 EXPORT FULL CSV FILE"),
    callback_data: "admin_export_csv",
    style: "success",
    icon_custom_emoji_id: "6154659543570714696"
  }
]);

// Row 3: Admin Panel & Main Menu
inlineKeyboard.push([
  {
    text: sc("🔙 ADMIN PANEL"),
    callback_data: "menu_admin_panel",
    style: "danger",
    icon_custom_emoji_id: "6154611916678369390"
  },
  {
    text: sc("MAIN MENU"),
    callback_data: "back_to_main",
    style: "primary",
    icon_custom_emoji_id: "5303040006347046717"
  }
]);

// In-place edit if coming from callback query so page switching is seamless and instant
var isEdit = false;
if (typeof request !== "undefined" && request && request.message && request.message.message_id) {
  try {
    Api.editMessageText({
      chat_id: chat.chatid,
      message_id: request.message.message_id,
      text: text,
      parse_mode: "html",
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: inlineKeyboard }
    });
    isEdit = true;
  } catch (e) {
    isEdit = false;
  }
}

if (!isEdit) {
  Api.sendMessage({
    chat_id: chat.chatid,
    text: text,
    parse_mode: "html",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: inlineKeyboard }
  });
}
