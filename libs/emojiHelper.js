/*LIB
  name: emojiHelper
  help: Small caps font converter, animated custom emoji transformer, and stylish inline keyboards
LIB*/

var DEFAULT_MUST_JOIN = ["@botadminshere", "@TOXIC_ADMINN"];

var DEFAULT_TEXT_EMOJIS = [
  "5303040006347046717", "5303548912726982102", "6154631793787015439", "5870568528049868382", 
  "6154603635981423575", "5267394977540889773", "5870619152829386951", "6154729229415093721", 
  "6154590274338166128", "6154565990593073474", "6154314868150243661", "6154659543570714696", 
  "6154635564768300782", "5267102967009402987", "5303178192624823421", "5337310516769467285"
];

var DEFAULT_BUTTON_EMOJIS = [
  "5213285132709929474", "5303040006347046717", "6154631793787015439", "5870568528049868382", 
  "6154729229415093721", "6154635564768300782", "6154718341672997377"
];

function sc(text) {
  if (!text) return "";
  var normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var small  = "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ0123456789";
  var res = "";
  for (var i = 0; i < text.length; i++) {
    var idx = normal.indexOf(text[i]);
    res += (idx !== -1) ? small[idx] : text[i];
  }
  return res;
}

function generate_id() {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var result = "";
  for (var i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function is_emoji(charStr) {
  var regex = /([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|\uFE0F|\u200D)+/;
  return regex.test(charStr);
}

function processTextAndEmojis(inputText) {
  if (!inputText) return "";
  var emojiDb = Bot.getProperty("emoji_db") || {};
  var pool = (emojiDb.text && emojiDb.text.length > 0) ? emojiDb.text : DEFAULT_TEXT_EMOJIS;
  
  var shuffled = pool.slice();
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  
  var poolIdx = 0;
  var emojiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|\uFE0F|\u200D)+/g;
  
  var processed = inputText.replace(emojiRegex, function(match) {
    var randId = shuffled[poolIdx % shuffled.length];
    poolIdx++;
    return "<tg-emoji emoji-id='" + randId + "'>✨</tg-emoji>";
  });
  
  return processed;
}

function main_menu(user_id) {
  var adminId = "8710308658";
  var rows = [
    [
      { text: sc("MAKE POST"), callback_data: "menu_make_post", style: "success", icon_custom_emoji_id: "5303040006347046717" },
      { text: sc("CONNECT CHANNELS"), callback_data: "menu_connect_channels", style: "primary", icon_custom_emoji_id: "5213285132709929474" }
    ],
    [
      { text: sc("SEND TO CHANNEL"), callback_data: "menu_send_channel", style: "success", icon_custom_emoji_id: "5213285132709929474" },
      { text: sc("INSTRUCTIONS"), callback_data: "menu_instructions", style: "primary", icon_custom_emoji_id: "6154314868150243661" }
    ]
  ];
  if (String(user_id) === adminId) {
    rows.push([
      { text: sc("ADMIN PANEL"), callback_data: "menu_admin_panel", style: "danger", icon_custom_emoji_id: "5870869476408299692" }
    ]);
  }
  return { inline_keyboard: rows };
}

function admin_keyboard() {
  return {
    inline_keyboard: [
      [
        { text: sc("STATUS"), callback_data: "admin_status", style: "primary", icon_custom_emoji_id: "4956599758044005301" },
        { text: sc("BROADCAST"), callback_data: "admin_broadcast", style: "success", icon_custom_emoji_id: "6154631793787015439" }
      ],
      [
        { text: sc("ADD TEXT EMOJI"), callback_data: "admin_add_text_emoji", style: "success", icon_custom_emoji_id: "6154718341672997377" },
        { text: sc("ADD BTN EMOJI"), callback_data: "admin_add_btn_emoji", style: "success", icon_custom_emoji_id: "6154718341672997377" }
      ],
      [
        { text: sc("TEXT EMOJI LIST"), callback_data: "admin_list_text_emojis", style: "primary", icon_custom_emoji_id: "6154659543570714696" },
        { text: sc("BTN EMOJI LIST"), callback_data: "admin_list_btn_emojis", style: "primary", icon_custom_emoji_id: "6154659543570714696" }
      ],
      [
        { text: sc("REMOVE EMOJI"), callback_data: "admin_remove_emoji", style: "danger", icon_custom_emoji_id: "5870869476408299692" },
        { text: sc("LIST CHANNELS"), callback_data: "admin_list_channels", style: "primary", icon_custom_emoji_id: "6154659543570714696" }
      ],
      [
        { text: sc("ADD CHANNEL"), callback_data: "admin_add_channel", style: "success", icon_custom_emoji_id: "6154718341672997377" },
        { text: sc("REMOVE CHANNEL"), callback_data: "admin_remove_channel", style: "danger", icon_custom_emoji_id: "5870869476408299692" }
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
        { text: sc("STEP BACK"), callback_data: "menu_admin_panel", style: "primary", icon_custom_emoji_id: "6154631793787015439" },
        { text: sc("MAIN MENU"), callback_data: "back_to_main", style: "success", icon_custom_emoji_id: "5303040006347046717" }
      ],
      [
        { text: sc("ADMIN PANEL"), callback_data: "menu_admin_panel", style: "danger", icon_custom_emoji_id: "5870869476408299692" }
      ]
    ]
  };
}

function normalizeChannel(ch) {
  if (!ch) return null;
  if (typeof ch === "string") {
    var raw = ch.trim();
    if (raw.indexOf("{") === 0) {
      try {
        var parsed = JSON.parse(raw);
        return normalizeChannel(parsed);
      } catch (e) {}
    }
    var isLink = raw.indexOf("http") === 0;
    var username = raw.replace(/^@/, "").replace(/^https?:\/\/t\.me\//, "").replace(/\/$/, "");
    var isId = (raw.indexOf("-100") === 0 || raw.indexOf("-") === 0);
    return {
      id: isId ? raw : (raw.indexOf("@") === 0 ? raw : ("@" + username)),
      title: isId ? raw : (raw.indexOf("@") === 0 ? raw : ("@" + username)),
      url: isLink ? raw : (isId ? "" : ("https://t.me/" + username)),
      type: isId ? "private" : "public"
    };
  }
  if (typeof ch === "object" && ch.id) {
    var chId = String(ch.id).trim();
    var chType = ch.type || (chId.indexOf("-100") === 0 ? "private" : "public");
    var chUrl = ch.url ? String(ch.url).trim() : (chId.indexOf("@") === 0 ? ("https://t.me/" + chId.replace("@", "")) : "");
    var chTitle = ch.title ? String(ch.title).trim() : chId;
    return {
      id: chId,
      title: chTitle,
      url: chUrl,
      type: chType
    };
  }
  return null;
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
  main_menu: main_menu,
  admin_keyboard: admin_keyboard,
  admin_navigation_markup: admin_navigation_markup,
  get_welcome_text: get_welcome_text,
  DEFAULT_MUST_JOIN: DEFAULT_MUST_JOIN,
  DEFAULT_TEXT_EMOJIS: DEFAULT_TEXT_EMOJIS,
  DEFAULT_BUTTON_EMOJIS: DEFAULT_BUTTON_EMOJIS
});