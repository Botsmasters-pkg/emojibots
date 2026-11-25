var DEFAULT_MUST_JOIN = [];

var DEFAULT_TEXT_EMOJIS = {};

var DEFAULT_BUTTON_EMOJIS = {};

function sc(str) {
  if (!str) return "";
  var normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var smallCaps = "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var res = "";
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);
    var idx = normal.indexOf(c);
    res += (idx !== -1) ? smallCaps.charAt(idx) : c;
  }
  return res;
}

function generate_id() {
  var chars = "0123456789";
  var res = "";
  for (var i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

function is_emoji(char) {
  var emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u;
  return emojiRegex.test(char);
}

function processTextAndEmojis(text) {
  if (!text) return "";
  var emojisDb = Bot.getProperty("custom_text_emojis") || DEFAULT_TEXT_EMOJIS;
  var keys = Object.keys(emojisDb);
  for (var i = 0; i < keys.length; i++) {
    var emo = keys[i];
    var customId = emojisDb[emo];
    if (customId) {
      var replacement = "<tg-emoji emoji-id='" + customId + "'>" + emo + "</tg-emoji>";
      text = text.split(emo).join(replacement);
    }
  }
  return text;
}

function normalizeChannel(ch) {
  if (!ch) return null;
  if (typeof ch === "string") {
    var raw = ch.trim();
    if (raw.indexOf("https://t.me/+") === 0 || raw.indexOf("https://t.me/joinchat/") === 0) {
      return {
        id: raw,
        title: "Private Channel",
        url: raw,
        type: "private"
      };
    }
    var cleanHandle = raw.replace(/^https?:\/\/t\.me\//, "").replace(/^@/, "");
    return {
      id: "@" + cleanHandle,
      title: "@" + cleanHandle,
      url: "https://t.me/" + cleanHandle,
      type: "public"
    };
  }
  if (typeof ch === "object") {
    var cType = ch.type || "public";
    var cId = ch.id ? String(ch.id) : "";
    var cTitle = ch.title || cId;
    var cUrl = ch.url || "";
    if (!cUrl && cId.indexOf("@") === 0) {
      cUrl = "https://t.me/" + cId.replace("@", "");
    }
    return {
      id: cId,
      title: cTitle,
      url: cUrl,
      type: cType
    };
  }
  return null;
}

function getChannelsFingerprint(mustJoin) {
  if (!mustJoin || mustJoin.length === 0) return "";
  var ids = [];
  for (var i = 0; i < mustJoin.length; i++) {
    var c = mustJoin[i];
    if (c && c.id) ids.push(String(c.id).toLowerCase());
  }
  ids.sort();
  return ids.join("|");
}

function isUserFsubVerified(telegramId, mustJoin) {
  if (!mustJoin || mustJoin.length === 0) return true;
  var currentFp = getChannelsFingerprint(mustJoin);
  
  // Check if user has left any channel
  var userLeft = Bot.getProperty("user_left_" + telegramId);
  if (userLeft) return false;
  
  // Check Bot-level override (set when chat_member detects leave)
  var botVerified = Bot.getProperty("fsub_verified_" + telegramId);
  if (botVerified === false) return false;
  
  // Check User-level verified status
  var userVerified = User.getProperty("fsub_verified");
  if (!userVerified) return false;
  
  // Check fingerprint match (ensures new channels require re-verification!)
  var userFp = User.getProperty("fsub_verified_fp");
  var botFp = Bot.getProperty("fsub_verified_fp_" + telegramId);
  if (userFp !== currentFp && botFp !== currentFp) return false;
  
  return true;
}

function main_menu(userTelegramId) {
  var adminId = "8710308658";
  var rows = [
    [
      { text: sc("MAKE POST"), callback_data: "menu_make_post", style: "success", icon_custom_emoji_id: "5337310516769467285" },
      { text: sc("CONNECT CHANNELS"), callback_data: "menu_connect_channels", style: "primary", icon_custom_emoji_id: "6154631793787015439" }
    ],
    [
      { text: sc("SEND TO CHANNEL"), callback_data: "menu_send_channel", style: "success", icon_custom_emoji_id: "6154314868150243661" },
      { text: sc("INSTRUCTIONS"), callback_data: "menu_instructions", style: "primary", icon_custom_emoji_id: "5429651785352501917" }
    ]
  ];

  if (String(userTelegramId) === adminId) {
    rows.push([
      { text: sc("👑 ADMIN PANEL"), callback_data: "menu_admin_panel", style: "danger", icon_custom_emoji_id: "6154611916678369390" }
    ]);
  }

  return { inline_keyboard: rows };
}

function admin_keyboard() {
  return {
    inline_keyboard: [
      [
        { text: sc("STATUS"), callback_data: "admin_status", style: "primary", icon_custom_emoji_id: "6154718341672997377" },
        { text: sc("BROADCAST"), callback_data: "admin_broadcast", style: "success", icon_custom_emoji_id: "6154631793787015439" }
      ],
      [
        { text: sc("ADD TEXT EMOJI"), callback_data: "admin_add_text_emoji", style: "success", icon_custom_emoji_id: "5337310516769467285" },
        { text: sc("ADD BTN EMOJI"), callback_data: "admin_add_btn_emoji", style: "success", icon_custom_emoji_id: "5337310516769467285" }
      ],
      [
        { text: sc("TEXT EMOJI LIST"), callback_data: "admin_list_text_emojis", style: "primary", icon_custom_emoji_id: "6154659543570714696" },
        { text: sc("BTN EMOJI LIST"), callback_data: "admin_list_btn_emojis", style: "primary", icon_custom_emoji_id: "6154659543570714696" }
      ],
      [
        { text: sc("REMOVE EMOJI"), callback_data: "admin_remove_emoji", style: "danger", icon_custom_emoji_id: "5870869476408299692" },
        { text: sc("LIST CHANNELS"), callback_data: "admin_list_channels", style: "primary", icon_custom_emoji_id: "6154631793787015439" }
      ],
      [
        { text: sc("ADD CHANNEL"), callback_data: "admin_add_channel", style: "success", icon_custom_emoji_id: "6154631793787015439" },
        { text: sc("REMOVE CHANNEL"), callback_data: "admin_remove_channel", style: "danger", icon_custom_emoji_id: "5870869476408299692" }
      ],
      [
        { text: sc("📡 CHANNEL CONTROL"), callback_data: "admin_channel_control", style: "primary", icon_custom_emoji_id: "6154631793787015439" }
      ],
      [
        { text: sc("CLEAN DB"), callback_data: "admin_clean_db", style: "danger", icon_custom_emoji_id: "5870869476408299692" },
        { text: sc("EXPORT USERS"), callback_data: "admin_export_users", style: "primary", icon_custom_emoji_id: "6154659543570714696" }
      ],
      [
        { text: sc("MAIN MENU"), callback_data: "back_to_main", style: "success", icon_custom_emoji_id: "5303040006347046717" }
      ]
    ]
  };
}

function admin_navigation_markup() {
  return {
    inline_keyboard: [
      [
        { text: sc("STEP BACK"), callback_data: "admin_list_channels", style: "primary", icon_custom_emoji_id: "5303040006347046717" },
        { text: sc("MAIN MENU"), callback_data: "back_to_main", style: "success", icon_custom_emoji_id: "5303040006347046717" }
      ],
      [
        { text: sc("ADMIN PANEL"), callback_data: "menu_admin_panel", style: "danger", icon_custom_emoji_id: "6154611916678369390" }
      ]
    ]
  };
}

function get_bot_username() {
  return Bot.getProperty("bot_username") || "PremiumEmojiRoBot";
}

function get_bot_title() {
  return Bot.getProperty("bot_title") || "Toxic Advanced Emoji & Post Builder";
}

function get_bot_id() {
  return Bot.getProperty("bot_telegram_id") || "";
}

function get_welcome_text() {
  return "<tg-emoji emoji-id='6154611916678369390'>👑</tg-emoji> <b>" + sc("WELCOME TO TOXIC PREMIUM EMOJI & POST BUILDER BOT!") + "</b>\n\n" +
    "<b>" + sc("Is bot ki madad se aap apne normal text emojis ko high-quality animated custom emojis me badal sakte hain, aur khubsurat inline buttons wale posts bana kar apne channels par publish kar sakte hain.") + "</b>\n\n" +
    "<b>" + sc("Neeche diye gaye main menu se apna kaam shuru karein:") + "</b>";
}

publish({
  sc: sc,
  generate_id: generate_id,
  is_emoji: is_emoji,
  processTextAndEmojis: processTextAndEmojis,
  normalizeChannel: normalizeChannel,
  getChannelsFingerprint: getChannelsFingerprint,
  isUserFsubVerified: isUserFsubVerified,
  main_menu: main_menu,
  admin_keyboard: admin_keyboard,
  admin_navigation_markup: admin_navigation_markup,
  get_welcome_text: get_welcome_text,
  get_bot_username: get_bot_username,
  get_bot_title: get_bot_title,
  get_bot_id: get_bot_id,
  DEFAULT_MUST_JOIN: DEFAULT_MUST_JOIN,
  DEFAULT_TEXT_EMOJIS: DEFAULT_TEXT_EMOJIS,
  DEFAULT_BUTTON_EMOJIS: DEFAULT_BUTTON_EMOJIS
});
