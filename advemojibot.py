import telebot
from telebot import types
from telebot.types import MessageEntity
import random
import string
import json
import os
import re

# --- CONFIGURATION ---
TOKEN = "8897974911:AAGrQvMDZ7keFTdATN9h5Bv5mwAHTaMKF20" 
ADMIN_ID = 8710308658
ADMIN_IDS = [8710308658]
bot = telebot.TeleBot(TOKEN)

# Database files
USERS_FILE = "users.json"
POSTS_FILE = "posts.json"
CHANNELS_FILE = "channels.json"
USER_CHANNELS_FILE = "user_channels.json"
EMOJIS_FILE = "emojis.json"

# --- DEFAULT DATA SETUP ---
DEFAULT_MUST_JOIN = ["@botadminshere", "@TOXIC_ADMINN"]
DEFAULT_TEXT_EMOJIS = [
    "5303040006347046717", "5303548912726982102", "6154631793787015439", "5870568528049868382", 
    "6154603635981423575", "5267394977540889773", "5870619152829386951", "6154729229415093721", 
    "6154590274338166128", "6154565990593073474", "6154314868150243661", "6154659543570714696", 
    "6154635564768300782", "5267102967009402987", "5303178192624823421", "5337310516769467285"
]
DEFAULT_BUTTON_EMOJIS = [
    "5213285132709929474", "5303040006347046717", "6154631793787015439", "5870568528049868382", 
    "6154729229415093721", "6154635564768300782", "6154718341672997377"
]

# Load Users
if os.path.exists(USERS_FILE):
    try:
        with open(USERS_FILE, "r") as f:
            registered_users = set(json.load(f))
    except:
        registered_users = set()
else:
    registered_users = set()

def save_users():
    with open(USERS_FILE, "w") as f:
        json.dump(list(registered_users), f)

# Load Channels
if os.path.exists(CHANNELS_FILE):
    try:
        with open(CHANNELS_FILE, "r") as f:
            MUST_JOIN = json.load(f)
            if not isinstance(MUST_JOIN, list):
                MUST_JOIN = DEFAULT_MUST_JOIN
    except:
        MUST_JOIN = DEFAULT_MUST_JOIN
else:
    MUST_JOIN = DEFAULT_MUST_JOIN
    with open(CHANNELS_FILE, "w") as f:
        json.dump(MUST_JOIN, f)

def save_channels():
    with open(CHANNELS_FILE, "w") as f:
        json.dump(MUST_JOIN, f)

# Load Emojis Database safely
if os.path.exists(EMOJIS_FILE):
    try:
        with open(EMOJIS_FILE, "r") as f:
            emoji_db = json.load(f)
            if not isinstance(emoji_db, dict):
                emoji_db = {"text": DEFAULT_TEXT_EMOJIS, "button": DEFAULT_BUTTON_EMOJIS}
            if "text" not in emoji_db:
                emoji_db["text"] = DEFAULT_TEXT_EMOJIS
            if "button" not in emoji_db:
                emoji_db["button"] = DEFAULT_BUTTON_EMOJIS
    except:
        emoji_db = {
            "text": DEFAULT_TEXT_EMOJIS,
            "button": DEFAULT_BUTTON_EMOJIS
        }
else:
    emoji_db = {
        "text": DEFAULT_TEXT_EMOJIS,
        "button": DEFAULT_BUTTON_EMOJIS
    }
    with open(EMOJIS_FILE, "w") as f:
        json.dump(emoji_db, f)

def save_emojis():
    with open(EMOJIS_FILE, "w") as f:
        json.dump(emoji_db, f)

# Images
START_IMAGE_URL = "C:/Users/admin/Downloads/ChatGPT Image Jun 4, 2026, 06_25_59 PM.png"
FINAL_IMAGE_URL = "C:/Users/admin/Downloads/ChatGPT Image Jun 4, 2026, 06_25_59 PM.png"

def serialize_entities(entities):
    if not entities:
        return []
    res = []
    for e in entities:
        if hasattr(e, 'to_dict'):
            res.append(e.to_dict())
        elif isinstance(e, dict):
            res.append(e)
    return res

def deserialize_entities(ent_list):
    if not ent_list:
        return []
    res = []
    for d in ent_list:
        if isinstance(d, dict):
            res.append(types.MessageEntity(
                type=d.get("type"),
                offset=d.get("offset"),
                length=d.get("length"),
                url=d.get("url"),
                user=d.get("user"),
                language=d.get("language"),
                custom_emoji_id=d.get("custom_emoji_id")
            ))
        else:
            res.append(d)
    return res

# Load Posts
if os.path.exists(POSTS_FILE):
    try:
        with open(POSTS_FILE, "r") as f:
            raw_posts = json.load(f)
            posts_db = {}
            for pid, pdata in raw_posts.items():
                pdata["entities"] = deserialize_entities(pdata.get("entities", []))
                posts_db[pid] = pdata
    except Exception:
        posts_db = {}
else:
    posts_db = {}

def save_posts():
    try:
        to_save = {}
        for pid, pdata in posts_db.items():
            to_save[pid] = {
                "id": pdata.get("id"),
                "content": pdata.get("content"),
                "entities": serialize_entities(pdata.get("entities", [])),
                "photo_id": pdata.get("photo_id"),
                "buttons": pdata.get("buttons", [])
            }
        with open(POSTS_FILE, "w") as f:
            json.dump(to_save, f)
    except Exception:
        pass

# Load User Channels
if os.path.exists(USER_CHANNELS_FILE):
    try:
        with open(USER_CHANNELS_FILE, "r") as f:
            raw_uc = json.load(f)
            user_channels = {int(k): v for k, v in raw_uc.items()}
    except:
        user_channels = {}
else:
    user_channels = {}

def save_user_channels():
    try:
        with open(USER_CHANNELS_FILE, "w") as f:
            json.dump({str(k): v for k, v in user_channels.items()}, f)
    except:
        pass

temp_data = {}

# ================= SMALL CAPS FONT FUNCTION =================
def sc(text):
    normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    small  = "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ0123456789"
    return text.translate(str.maketrans(normal, small))

def is_emoji(char):
    emoji_pattern = re.compile("[\U0001f000-\U0001faf8\u2600-\u27bf\U0001f900-\U0001f9ff\U0001f600-\U0001f64f\U0001f300-\U0001f5ff\U0001f680-\U0001f6ff]")
    return bool(emoji_pattern.match(char))

def generate_id():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

def check_must_join(user_id):
    for channel in MUST_JOIN:
        try:
            member = bot.get_chat_member(channel, user_id)
            if member.status in ['left', 'kicked']:
                return False
        except:
            return False
    return True

def process_text_and_entities(message):
    input_text = message.text or message.caption or ""
    original_entities = message.entities or message.caption_entities or []
    final_text, new_entities = "", []
    
    offset_map = {}
    current_old_offset = 0
    current_new_offset = 0
    
    text_emojis_pool = list(emoji_db.get("text", DEFAULT_TEXT_EMOJIS))
    
    if text_emojis_pool:
        random.shuffle(text_emojis_pool)
    pool_index = 0
    last_rand_id = None
    
    for char in input_text:
        offset_map[current_old_offset] = current_new_offset
        char_utf16_len = len(char.encode('utf-16-le')) // 2
        
        if is_emoji(char):
            if text_emojis_pool:
                rand_id = text_emojis_pool[pool_index % len(text_emojis_pool)]
                pool_index += 1
                if len(text_emojis_pool) > 1 and rand_id == last_rand_id:
                    rand_id = text_emojis_pool[pool_index % len(text_emojis_pool)]
                    pool_index += 1
                last_rand_id = rand_id
            else:
                rand_id = "5870619152829386951"
                
            placeholder = "✨" 
            new_entities.append(MessageEntity(
                type="custom_emoji", 
                offset=current_new_offset, 
                length=len(placeholder), 
                custom_emoji_id=rand_id
            ))
            final_text += placeholder
            current_old_offset += char_utf16_len
            current_new_offset += len(placeholder)
        else:
            final_text += char
            current_old_offset += char_utf16_len
            current_new_offset += len(char)
            
    offset_map[current_old_offset] = current_new_offset
    
    for ent in original_entities:
        if ent.type == "custom_emoji": 
            continue
            
        new_start = offset_map.get(ent.offset)
        new_end = offset_map.get(ent.offset + ent.length)
        
        if new_start is not None and new_end is not None:
            new_entities.append(MessageEntity(
                type=ent.type, 
                offset=new_start, 
                length=new_end - new_start, 
                url=ent.url, 
                user=ent.user, 
                language=ent.language, 
                custom_emoji_id=ent.custom_emoji_id
            ))
            
    return final_text, new_entities

# ================= STYLISH INLINE MENUS =================
def main_menu(user_id):
    markup = types.InlineKeyboardMarkup()
    markup.row(
        types.InlineKeyboardButton(sc("MAKE POST"), callback_data="menu_make_post", style="success", icon_custom_emoji_id="5303040006347046717"),
        types.InlineKeyboardButton(sc("CONNECT CHANNELS"), callback_data="menu_connect_channels", style="primary", icon_custom_emoji_id="5213285132709929474")
    )
    markup.row(
        types.InlineKeyboardButton(sc("SEND TO CHANNEL"), callback_data="menu_send_channel", style="success", icon_custom_emoji_id="5213285132709929474"),
        types.InlineKeyboardButton(sc("INSTRUCTIONS"), callback_data="menu_instructions", style="primary", icon_custom_emoji_id="6154314868150243661")
    )
    if user_id in ADMIN_IDS:
        markup.row(
            types.InlineKeyboardButton(sc("ADMIN PANEL"), callback_data="menu_admin_panel", style="danger", icon_custom_emoji_id="5870869476408299692")
        )
    return markup

def admin_keyboard():
    markup = types.InlineKeyboardMarkup()
    markup.row(
        types.InlineKeyboardButton(sc("STATUS"), callback_data="admin_status", style="primary", icon_custom_emoji_id="4956599758044005301"),
        types.InlineKeyboardButton(sc("BROADCAST"), callback_data="admin_broadcast", style="success", icon_custom_emoji_id="6154631793787015439")
    )
    markup.row(
        types.InlineKeyboardButton(sc("ADD TEXT EMOJI"), callback_data="admin_add_text_emoji", style="success", icon_custom_emoji_id="6154718341672997377"),
        types.InlineKeyboardButton(sc("ADD BTN EMOJI"), callback_data="admin_add_btn_emoji", style="success", icon_custom_emoji_id="6154718341672997377")
    )
    markup.row(
        types.InlineKeyboardButton(sc("TEXT EMOJI LIST"), callback_data="admin_list_text_emojis", style="primary", icon_custom_emoji_id="6154659543570714696"),
        types.InlineKeyboardButton(sc("BTN EMOJI LIST"), callback_data="admin_list_btn_emojis", style="primary", icon_custom_emoji_id="6154659543570714696")
    )
    markup.row(
        types.InlineKeyboardButton(sc("REMOVE EMOJI"), callback_data="admin_remove_emoji", style="danger", icon_custom_emoji_id="5870869476408299692"),
        types.InlineKeyboardButton(sc("LIST CHANNELS"), callback_data="admin_list_channels", style="primary", icon_custom_emoji_id="6154659543570714696")
    )
    markup.row(
        types.InlineKeyboardButton(sc("ADD CHANNEL"), callback_data="admin_add_channel", style="success", icon_custom_emoji_id="6154718341672997377"),
        types.InlineKeyboardButton(sc("REMOVE CHANNEL"), callback_data="admin_remove_channel", style="danger", icon_custom_emoji_id="5870869476408299692")
    )
    markup.row(
        types.InlineKeyboardButton(sc("CLEAN DB"), callback_data="admin_clean_db", style="danger", icon_custom_emoji_id="5870869476408299692"),
        types.InlineKeyboardButton(sc("EXPORT USERS"), callback_data="admin_export_users", style="primary", icon_custom_emoji_id="6154659543570714696")
    )
    markup.row(
        types.InlineKeyboardButton(sc("MAIN MENU"), callback_data="back_to_main", style="success", icon_custom_emoji_id="5303040006347046717")
    )
    return markup

# ================= ADMIN NAVIGATION BACK BUTTONS (ALIGNED CLEANLY) =================
def admin_navigation_markup():
    markup = types.InlineKeyboardMarkup()
    markup.row(
        types.InlineKeyboardButton(sc("STEP BACK"), callback_data="menu_admin_panel", style="primary", icon_custom_emoji_id="6154631793787015439"),
        types.InlineKeyboardButton(sc("MAIN MENU"), callback_data="back_to_main", style="success", icon_custom_emoji_id="5303040006347046717")
    )
    markup.row(
        types.InlineKeyboardButton(sc("ADMIN PANEL"), callback_data="menu_admin_panel", style="danger", icon_custom_emoji_id="5870869476408299692")
    )
    return markup

# --- GROUP RESTRICTION MIDDLEWARE ---
@bot.message_handler(func=lambda message: message.chat.type != 'private')
def ignore_group_messages(message):
    return

@bot.callback_query_handler(func=lambda call: call.message.chat.type != 'private')
def ignore_group_callbacks(call):
    return

# --- HANDLERS ---
@bot.message_handler(commands=['start'])
def welcome(message):
    if message.chat.id not in registered_users:
        registered_users.add(message.chat.id)
        save_users()
    
    if not check_must_join(message.from_user.id):
        markup = types.InlineKeyboardMarkup()
        for ch in MUST_JOIN:
            markup.row(types.InlineKeyboardButton(f"JOIN {ch}", url=f"https://t.me/{ch.lstrip('@')}", style="primary", icon_custom_emoji_id="6154631793787015439"))
        markup.row(types.InlineKeyboardButton(sc("VERIFY JOIN"), callback_data="check_join", style="success", icon_custom_emoji_id="6154718341672997377"))
        
        msg_text = f"<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>{sc('ACCESS DENIED! PLEASE JOIN ALL REQUIRED CHANNELS TO UNLOCK FULL BOT FEATURES AND PREMIUM ACCESS.')}</b>"
        return bot.send_message(message.chat.id, msg_text, reply_markup=markup, parse_mode="HTML")
    
    welcome_text = (
        f"<tg-emoji emoji-id='6154611916678369390'>👑</tg-emoji> <b>{sc('WELCOME TO TOXIC PREMIUM EMOJI & POST BUILDER BOT!')}</b>\n\n"
        f"<b>{sc('Is bot ki madad se aap apne normal text emojis ko high-quality animated custom emojis me badal sakte hain, aur khubsurat inline buttons wale posts bana kar apne channels par publish kar sakte hain.')}</b>\n\n"
        f"<b>{sc('Neeche diye gaye main menu se apna kaam shuru karein:')}</b>"
    )
    
    try:
        bot.send_photo(message.chat.id, START_IMAGE_URL, caption=welcome_text, reply_markup=main_menu(message.chat.id), parse_mode="HTML")
    except:
        bot.send_message(message.chat.id, welcome_text, reply_markup=main_menu(message.chat.id), parse_mode="HTML")

@bot.callback_query_handler(func=lambda call: call.data == "check_join")
def verify_callback(call):
    if check_must_join(call.from_user.id):
        bot.answer_callback_query(call.id, sc("Success! Ab aap bot use kar sakte hain."))
        bot.send_message(call.message.chat.id, f"<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>{sc('VERIFICATION SUCCESSFUL! ALL CHANNELS JOINED SUCCESSFULLY. PLEASE USE THE MENU BELOW.')}</b>", reply_markup=main_menu(call.message.chat.id), parse_mode="HTML")
    else:
        bot.answer_callback_query(call.id, sc("HAVEN'T JOINED YET! PLEASE JOIN ALL CHANNELS."), show_alert=True)

# --- GLOBAL NAVIGATION HANDLERS ---
@bot.callback_query_handler(func=lambda call: call.data == "back_to_main")
def back_to_main_cb(call):
    bot.answer_callback_query(call.id)
    welcome_text = (
        f"<tg-emoji emoji-id='6154611916678369390'>👑</tg-emoji> <b>{sc('WELCOME TO TOXIC PREMIUM EMOJI & POST BUILDER BOT!')}</b>\n\n"
        f"<b>{sc('Is bot ki madad se aap apne normal text emojis ko high-quality animated custom emojis me badal sakte hain, aur khubsurat inline buttons wale posts bana kar apne channels par publish kar sakte hain.')}</b>\n\n"
        f"<b>{sc('Neeche diye gaye main menu se apna kaam shuru karein:')}</b>"
    )
    try:
        bot.send_photo(call.message.chat.id, START_IMAGE_URL, caption=welcome_text, reply_markup=main_menu(call.message.chat.id), parse_mode="HTML")
    except:
        bot.send_message(call.message.chat.id, welcome_text, reply_markup=main_menu(call.message.chat.id), parse_mode="HTML")

# --- MAIN MENU ROUTER ---
@bot.callback_query_handler(func=lambda call: call.data.startswith("menu_"))
def menu_router(call):
    user_id = call.from_user.id
    if not check_must_join(user_id):
        bot.answer_callback_query(call.id, sc("Please join channels first!"), show_alert=True)
        return
        
    action = call.data.replace("menu_", "")
    bot.answer_callback_query(call.id)
    
    if action == "make_post":
        start_post_cb(call.message)
    elif action == "connect_channels":
        ask_channel_cb(call.message)
    elif action == "send_channel":
        ask_post_id_cb(call.message)
    elif action == "instructions":
        show_instructions_cb(call.message)
    elif action == "admin_panel" and user_id in ADMIN_IDS:
        admin_panel_cb(call.message)

def show_instructions_cb(message):
    text = (
        f"<tg-emoji emoji-id='6154314868150243661'>📖</tg-emoji> <b>{sc('DETAILED COMPREHENSIVE GUIDE & INSTRUCTIONS:')}</b>\n\n"
        f"1. **{sc('MAKE POST')}**: {sc('Click karke apna text bhejein. Text ke andar ke normal emojis automatic high-quality custom emojis me convert ho jayenge.')}\n"
        f"2. **{sc('MEDIA & BUTTONS')}**: {sc('Aap optional image attach kar sakte hain aur multiple custom styled buttons add kar sakte hain.')}\n"
        f"3. **{sc('CONNECT CHANNELS')}**: {sc('Apne channel ko connect karne ke liye bot ko channel par admin banayein aur channel username ya message forward karein.')}\n"
        f"4. **{sc('SEND TO CHANNEL')}**: {sc('Apna Unique Post ID enter karein aur connect kiye gaye channel par instant dispatch karein.')}"
    )
    bot.send_message(message.chat.id, text, parse_mode="HTML", reply_markup=main_menu(message.chat.id))

def admin_panel_cb(message):
    text = f"<tg-emoji emoji-id='6154611916678369390'>👑</tg-emoji> <b>{sc('ADMIN CONTROL MANAGEMENT PANEL:')}</b>\n\n{sc('Yahan se aap bot ke saare controls, channels list, custom emojis database aur user analytics manage kar sakte hain.')}"
    bot.send_message(message.chat.id, text, reply_markup=admin_keyboard(), parse_mode="HTML")

# --- FULL ADMIN CALLBACK HANDLERS ---
@bot.callback_query_handler(func=lambda call: call.data.startswith("admin_"))
def admin_callback(call):
    user_id = call.from_user.id
    if user_id not in ADMIN_IDS:
        bot.answer_callback_query(call.id, sc("Unauthorized Access!"), show_alert=True)
        return

    if call.data == "admin_status":
        bot.answer_callback_query(call.id)
        total_users = len(registered_users)
        total_posts = len(posts_db)
        total_channels = len(MUST_JOIN)
        total_text_emojis = len(emoji_db.get("text", []))
        total_btn_emojis = len(emoji_db.get("button", []))
        connected_channels_count = sum(len(ch_list) for ch_list in user_channels.values())
        
        status_text = (
            f"<tg-emoji emoji-id='4956599758044005301'>📊</tg-emoji> <b>{sc('DETAILED SYSTEM ANALYTICS & STATUS DASHBOARD:')}</b>\n\n"
            f"• **{sc('Total Registered Users')}**: <code>{total_users}</code>\n"
            f"• **{sc('Active Users / Session')}**: <code>{total_users}</code>\n"
            f"• **{sc('Forced Join Channels')}**: <code>{total_channels}</code>\n"
            f"• **{sc('Connected User Channels')}**: <code>{connected_channels_count}</code>\n"
            f"• **{sc('Configured Text Emojis')}**: <code>{total_text_emojis}</code>\n"
            f"• **{sc('Configured Button Emojis')}**: <code>{total_btn_emojis}</code>\n"
            f"• **{sc('Generated Posts in DB')}**: <code>{total_posts}</code>\n"
            f"• **{sc('Bot Status')}**: 🟢 <code>{sc('ONLINE & FULLY ACTIVE')}</code>\n\n"
            f"<b>{sc('All systems are operating smoothly with optimal performance.')}</b>"
        )
        bot.send_message(call.message.chat.id, status_text, parse_mode="HTML", reply_markup=admin_navigation_markup())

    elif call.data == "admin_broadcast":
        bot.answer_callback_query(call.id)
        sent = bot.send_message(call.message.chat.id, f"<tg-emoji emoji-id='6154631793787015439'>📢</tg-emoji> <b>{sc('Please send the message you want to broadcast to all registered users:')}</b>", parse_mode="HTML", reply_markup=admin_navigation_markup())
        bot.register_next_step_handler(sent, perform_broadcast)

    elif call.data == "admin_add_text_emoji":
        bot.answer_callback_query(call.id)
        sent = bot.send_message(call.message.chat.id, f"<tg-emoji emoji-id='6154718341672997377'>➕</tg-emoji> <b>{sc('Aap ek ya ek se zyada Text Custom Emoji IDs ek saath bhej sakte hain (space ya newline se alag karke):')}</b>", parse_mode="HTML", reply_markup=admin_navigation_markup())
        bot.register_next_step_handler(sent, save_new_text_emoji)

    elif call.data == "admin_add_btn_emoji":
        bot.answer_callback_query(call.id)
        sent = bot.send_message(call.message.chat.id, f"<tg-emoji emoji-id='6154718341672997377'>➕</tg-emoji> <b>{sc('Aap ek ya ek se zyada Button Custom Emoji IDs ek saath bhej sakte hain (space ya newline se alag karke):')}</b>", parse_mode="HTML", reply_markup=admin_navigation_markup())
        bot.register_next_step_handler(sent, save_new_btn_emoji)

    elif call.data == "admin_list_text_emojis":
        bot.answer_callback_query(call.id)
        text_emojis = emoji_db.get("text", [])
        text_list = "\n".join([f"• <code>{eid}</code>" for eid in text_emojis]) if text_emojis else sc("No text emojis.")
        msg = (
            f"<tg-emoji emoji-id='6154659543570714696'>📋</tg-emoji> <b>{sc('TEXT EMOJIS DATABASE LIST')} (Total: {len(text_emojis)}):</b>\n\n{text_list}"
        )
        try:
            if len(msg) < 4000:
                bot.send_message(call.message.chat.id, msg, parse_mode="HTML", reply_markup=admin_navigation_markup())
            else:
                for i in range(0, len(text_emojis), 100):
                    chunk = text_emojis[i:i+100]
                    chunk_list = "\n".join([f"• <code>{eid}</code>" for eid in chunk])
                    chunk_msg = f"<b>📝 {sc('Text Emojis')} ({i+1}-{i+len(chunk)} / {len(text_emojis)}):</b>\n{chunk_list}"
                    markup = admin_navigation_markup() if i + 100 >= len(text_emojis) else None
                    bot.send_message(call.message.chat.id, chunk_msg, parse_mode="HTML", reply_markup=markup)
        except Exception as e:
            bot.send_message(call.message.chat.id, f"❌ Error: {e}", parse_mode="HTML", reply_markup=admin_navigation_markup())

    elif call.data == "admin_list_btn_emojis":
        bot.answer_callback_query(call.id)
        btn_emojis = emoji_db.get("button", [])
        btn_list = "\n".join([f"• <code>{eid}</code>" for eid in btn_emojis]) if btn_emojis else sc("No button emojis.")
        msg = (
            f"<tg-emoji emoji-id='6154659543570714696'>📋</tg-emoji> <b>{sc('BUTTON EMOJIS DATABASE LIST')} (Total: {len(btn_emojis)}):</b>\n\n{btn_list}"
        )
        try:
            if len(msg) < 4000:
                bot.send_message(call.message.chat.id, msg, parse_mode="HTML", reply_markup=admin_navigation_markup())
            else:
                for i in range(0, len(btn_emojis), 100):
                    chunk = btn_emojis[i:i+100]
                    chunk_list = "\n".join([f"• <code>{eid}</code>" for eid in chunk])
                    chunk_msg = f"<b>🔘 {sc('Button Emojis')} ({i+1}-{i+len(chunk)} / {len(btn_emojis)}):</b>\n{chunk_list}"
                    markup = admin_navigation_markup() if i + 100 >= len(btn_emojis) else None
                    bot.send_message(call.message.chat.id, chunk_msg, parse_mode="HTML", reply_markup=markup)
        except Exception as e:
            bot.send_message(call.message.chat.id, f"❌ Error: {e}", parse_mode="HTML", reply_markup=admin_navigation_markup())

    elif call.data == "admin_remove_emoji":
        bot.answer_callback_query(call.id)
        sent = bot.send_message(call.message.chat.id, f"<tg-emoji emoji-id='5870869476408299692'>🗑</tg-emoji> <b>{sc('Aap ek ya ek se zyada Emoji IDs ek saath bhej sakte hain remove karne ke liye (space ya newline se alag karke):')}</b>", parse_mode="HTML", reply_markup=admin_navigation_markup())
        bot.register_next_step_handler(sent, remove_emoji_id)

    elif call.data == "admin_list_channels":
        bot.answer_callback_query(call.id)
        ch_list_str = "\n".join([f"• <code>{ch}</code>" for ch in MUST_JOIN]) if MUST_JOIN else sc("No channels configured.")
        text = f"<tg-emoji emoji-id='6154659543570714696'>📋</tg-emoji> <b>{sc('CURRENT MANDATORY JOIN CHANNELS LIST:')}</b>\n\n{ch_list_str}"
        bot.send_message(call.message.chat.id, text, parse_mode="HTML", reply_markup=admin_navigation_markup())

    elif call.data == "admin_add_channel":
        bot.answer_callback_query(call.id)
        sent = bot.send_message(call.message.chat.id, f"<tg-emoji emoji-id='6154718341672997377'>➕</tg-emoji> <b>{sc('Please send the channel username to add (e.g., @channelname):')}</b>", parse_mode="HTML", reply_markup=admin_navigation_markup())
        bot.register_next_step_handler(sent, save_new_channel)

    elif call.data == "admin_remove_channel":
        bot.answer_callback_query(call.id)
        sent = bot.send_message(call.message.chat.id, f"<tg-emoji emoji-id='5870869476408299692'>➖</tg-emoji> <b>{sc('Please send the channel username to remove (e.g., @channelname):')}</b>", parse_mode="HTML", reply_markup=admin_navigation_markup())
        bot.register_next_step_handler(sent, delete_channel)

    elif call.data == "admin_clean_db":
        bot.answer_callback_query(call.id)
        posts_db.clear()
        bot.send_message(call.message.chat.id, f"<tg-emoji emoji-id='5870869476408299692'>🧹</tg-emoji> <b>{sc('Posts database cleaned successfully! All temporary posts cleared.')}</b>", parse_mode="HTML", reply_markup=admin_navigation_markup())

    elif call.data == "admin_export_users":
        bot.answer_callback_query(call.id)
        if os.path.exists(USERS_FILE):
            with open(USERS_FILE, "rb") as f:
                bot.send_document(call.message.chat.id, f, caption=f"<tg-emoji emoji-id='6154659543570714696'>📊</tg-emoji> <b>{sc('Complete Registered Users Database Backup File')}</b>", parse_mode="HTML", reply_markup=admin_navigation_markup())
        else:
            bot.send_message(call.message.chat.id, f"<tg-emoji emoji-id='6154619152829386951'>❌</tg-emoji> <b>{sc('Users file not found in directory.')}</b>", parse_mode="HTML", reply_markup=admin_navigation_markup())

# --- ADMIN HELPER FUNCTIONS (BULK ADD & REMOVE SUPPORTED) ---
def perform_broadcast(message):
    if not message.text:
        return
    success_count = 0
    fail_count = 0
    for uid in list(registered_users):
        try: 
            bot.copy_message(uid, message.chat.id, message.message_id)
            success_count += 1
        except: 
            fail_count += 1
    bot.send_message(ADMIN_ID, f"<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>{sc('Broadcast Completed Successfully!')}</b>\n\n• Sent: <code>{success_count}</code>\n• Failed: <code>{fail_count}</code>", parse_mode="HTML", reply_markup=admin_keyboard())

def save_new_text_emoji(message):
    if not message.text:
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Please send valid emoji IDs.')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())
        return
    content = message.text.strip()
    ids = re.split(r'[\s,\n]+', content)
    added_count = 0
    for eid in ids:
        eid = eid.strip()
        if eid.isdigit() and eid not in emoji_db["text"]:
            emoji_db["text"].append(eid)
            added_count += 1
    if added_count > 0:
        save_emojis()
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>{added_count} {sc('Text emoji IDs successfully added to database!')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())
    else:
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('No valid or new IDs found.')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())

def save_new_btn_emoji(message):
    if not message.text:
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Please send valid emoji IDs.')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())
        return
    content = message.text.strip()
    ids = re.split(r'[\s,\n]+', content)
    added_count = 0
    for eid in ids:
        eid = eid.strip()
        if eid.isdigit() and eid not in emoji_db["button"]:
            emoji_db["button"].append(eid)
            added_count += 1
    if added_count > 0:
        save_emojis()
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>{added_count} {sc('Button emoji IDs successfully added to database!')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())
    else:
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('No valid or new IDs found.')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())

def remove_emoji_id(message):
    if not message.text:
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Please send valid emoji IDs.')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())
        return
    content = message.text.strip()
    ids = re.split(r'[\s,\n]+', content)
    removed_count = 0
    
    for eid in ids:
        eid = eid.strip()
        if not eid:
            continue
        if eid in emoji_db["text"]:
            emoji_db["text"].remove(eid)
            removed_count += 1
        if eid in emoji_db["button"]:
            emoji_db["button"].remove(eid)
            removed_count += 1
            
    if removed_count > 0:
        save_emojis()
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>{removed_count} {sc('Emoji IDs successfully removed from database!')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())
    else:
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('No matching Emoji IDs found in database.')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())

def save_new_channel(message):
    if not message.text:
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Please send a valid channel username.')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())
        return
    ch = message.text.strip()
    if ch.startswith("@") and ch not in MUST_JOIN:
        MUST_JOIN.append(ch)
        save_channels()
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>{sc('Channel successfully added to mandatory join list!')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())
    else:
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Invalid channel username or already exists.')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())

def delete_channel(message):
    if not message.text:
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Please send a valid channel username.')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())
        return
    ch = message.text.strip()
    if ch in MUST_JOIN:
        MUST_JOIN.remove(ch)
        save_channels()
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>{sc('Channel removed successfully from mandatory join list!')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())
    else:
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Channel not found in list.')}</b>", parse_mode="HTML", reply_markup=admin_keyboard())

# --- MAKE POST FLOW ---
def start_post_cb(message):
    user_id = message.chat.id
    sent = bot.send_message(user_id, f"<tg-emoji emoji-id='5337310516769467285'>📝</tg-emoji> <b>{sc('PLEASE SEND YOUR TEXT CONTENT WITH NORMAL Emojis (wo automatic custom emojis me convert ho jayenge):')}</b>", parse_mode="HTML")
    bot.register_next_step_handler(sent, save_text_content)

def save_text_content(message):
    user_id = message.chat.id
    if not message.text:
        sent = bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('PLEASE PROVIDE VALID TEXT CONTENT!')}</b>", parse_mode="HTML")
        bot.register_next_step_handler(sent, save_text_content)
        return

    processed_text, entities = process_text_and_entities(message)
    temp_data[user_id] = {
        "id": generate_id(),
        "content": processed_text,
        "entities": entities,
        "buttons": [],
        "photo_id": None
    }
    
    markup = types.InlineKeyboardMarkup()
    markup.row(
        types.InlineKeyboardButton(sc("ADD MEDIA"), callback_data="media_yes", style="success", icon_custom_emoji_id="5429651785352501917"),
        types.InlineKeyboardButton(sc("TEXT ONLY"), callback_data="media_no", style="primary", icon_custom_emoji_id="5337310516769467285")
    )
    bot.send_message(user_id, f"<tg-emoji emoji-id='6154635564768300782'>📌</tg-emoji> <b>{sc('DO YOU WANT TO ATTACH AN IMAGE MEDIA TO YOUR POST?')}</b>", reply_markup=markup, parse_mode="HTML")

@bot.callback_query_handler(func=lambda call: call.data in ["media_yes", "media_no"])
def process_media_choice_cb(call):
    user_id = call.message.chat.id
    bot.answer_callback_query(call.id)
    if user_id not in temp_data:
        bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Session expired! Please click MAKE POST to create a new post.')}</b>", parse_mode="HTML", reply_markup=main_menu(user_id))
        return
    
    if call.data == "media_yes":
        sent = bot.send_message(user_id, f"<tg-emoji emoji-id='5429651785352501917'>🖼</tg-emoji> <b>{sc('PLEASE SEND THE IMAGE FILE OR PHOTO NOW:')}</b>", parse_mode="HTML")
        bot.register_next_step_handler(sent, save_photo_only)
    else:
        ask_for_buttons(user_id)

def save_photo_only(message):
    user_id = message.chat.id
    if user_id not in temp_data:
        bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Session expired! Please click MAKE POST to create a new post.')}</b>", parse_mode="HTML", reply_markup=main_menu(user_id))
        return
    if message.content_type != 'photo':
        sent = bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('PLEASE UPLOAD A VALID IMAGE FILE!')}</b>", parse_mode="HTML")
        bot.register_next_step_handler(sent, save_photo_only)
        return
        
    temp_data[user_id]["photo_id"] = message.photo[-1].file_id
    ask_for_buttons(user_id)

# --- BUTTONS CREATION LOGIC ---
def ask_for_buttons(user_id):
    if user_id not in temp_data:
        bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Session expired! Please click MAKE POST to create a new post.')}</b>", parse_mode="HTML", reply_markup=main_menu(user_id))
        return
    markup = types.InlineKeyboardMarkup()
    if len(temp_data[user_id]["buttons"]) == 0:
        markup.row(types.InlineKeyboardButton(sc("SKIP BUTTON"), callback_data="btn_skip", style="danger", icon_custom_emoji_id="5870869476408299692"))
    else:
        markup.row(types.InlineKeyboardButton(sc("DONE & FINALIZE"), callback_data="btn_done", style="success", icon_custom_emoji_id="6154718341672997377"))
        
    sent = bot.send_message(
        user_id, 
        f"<tg-emoji emoji-id='6154635564768300782'>📌</tg-emoji> <b>{sc('PLEASE ENTER THE BUTTON NAME (Aap yahan normal emoji bhi daal sakte ho, wo animated custom emoji ban jayega!):')}</b>", 
        parse_mode="HTML", 
        reply_markup=markup
    )
    bot.register_next_step_handler(sent, process_button_name)

@bot.callback_query_handler(func=lambda call: call.data in ["btn_skip", "btn_done"])
def skip_or_done_buttons(call):
    user_id = call.message.chat.id
    bot.answer_callback_query(call.id)
    if user_id not in temp_data:
        bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Session expired! Please click MAKE POST to create a new post.')}</b>", parse_mode="HTML", reply_markup=main_menu(user_id))
        return
    finalize_post(call.message)

def process_button_name(message):
    user_id = message.chat.id
    if user_id not in temp_data:
        bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Session expired! Please click MAKE POST to create a new post.')}</b>", parse_mode="HTML", reply_markup=main_menu(user_id))
        return
    if not message.text:
        sent = bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('PLEASE PROVIDE A VALID BUTTON NAME!')}</b>", parse_mode="HTML")
        bot.register_next_step_handler(sent, process_button_name)
        return
    text = message.text

    btn_emojis_pool = emoji_db.get("button", DEFAULT_BUTTON_EMOJIS)
    chosen_icon_id = random.choice(btn_emojis_pool) if btn_emojis_pool else "5213285132709929474"
    
    cleaned_name = "".join([c for c in text if not is_emoji(c)]).strip()
    if not cleaned_name:
        cleaned_name = "Button"
        
    temp_data[user_id]["current_btn_name"] = cleaned_name
    temp_data[user_id]["current_btn_icon"] = chosen_icon_id
    
    sent = bot.send_message(user_id, f"<tg-emoji emoji-id='6154729229415093721'>📎</tg-emoji> <b>{sc('PLEASE SEND THE DESTINATION LINK URL FOR THIS BUTTON (e.g., https://t.me/...):')}</b>", parse_mode="HTML")
    bot.register_next_step_handler(sent, process_button_link)

def process_button_link(message):
    user_id = message.chat.id
    if user_id not in temp_data:
        bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Session expired! Please click MAKE POST to create a new post.')}</b>", parse_mode="HTML", reply_markup=main_menu(user_id))
        return
    if not message.text:
        sent = bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('PLEASE PROVIDE A VALID URL!')}</b>", parse_mode="HTML")
        bot.register_next_step_handler(sent, process_button_link)
        return
    url = message.text.strip()
    
    if not (url.startswith("http://") or url.startswith("https://") or url.startswith("t.me/")):
        sent = bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('INVALID URL FORMAT! PROVIDE A VALID LINK STARTING WITH http:// OR https://:')}</b>", parse_mode="HTML")
        bot.register_next_step_handler(sent, process_button_link)
        return

    temp_data[user_id]["current_btn_url"] = url
    
    markup = types.InlineKeyboardMarkup()
    markup.row(
        types.InlineKeyboardButton(sc("RED (DANGER)"), callback_data="color_danger", style="danger", icon_custom_emoji_id="5870869476408299692"),
        types.InlineKeyboardButton(sc("GREEN (SUCCESS)"), callback_data="color_success", style="success", icon_custom_emoji_id="6154718341672997377")
    )
    markup.row(
        types.InlineKeyboardButton(sc("BLUE (PRIMARY)"), callback_data="color_primary", style="primary", icon_custom_emoji_id="6154631793787015439"),
        types.InlineKeyboardButton(sc("SKIP COLOR"), callback_data="color_skip", style="primary", icon_custom_emoji_id="5870619152829386951")
    )
    bot.send_message(user_id, f"<tg-emoji emoji-id='6154631793787015439'>🎨</tg-emoji> <b>{sc('PLEASE SELECT YOUR PREFERRED BUTTON COLOR STYLE:')}</b>", reply_markup=markup, parse_mode="HTML")

@bot.callback_query_handler(func=lambda call: call.data.startswith("color_"))
def process_button_color_cb(call):
    user_id = call.message.chat.id
    bot.answer_callback_query(call.id)
    if user_id not in temp_data:
        bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Session expired! Please click MAKE POST to create a new post.')}</b>", parse_mode="HTML", reply_markup=main_menu(user_id))
        return
    
    action = call.data.replace("color_", "")
    style_val = None
    if action == "danger": 
        style_val = "danger"
    elif action == "success": 
        style_val = "success"
    elif action == "primary": 
        style_val = "primary"
        
    name = temp_data[user_id].pop("current_btn_name", "Button")
    url = temp_data[user_id].pop("current_btn_url", "")
    icon_id = temp_data[user_id].pop("current_btn_icon", None)
    
    btn_dict = {"name": name, "url": url, "icon_custom_emoji_id": icon_id}
    if style_val: 
        btn_dict["style"] = style_val
        
    temp_data[user_id]["buttons"].append(btn_dict)
    
    bot.send_message(user_id, f"<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>{sc('BUTTON ADDED SUCCESSFULLY!')}</b> (Total: {len(temp_data[user_id]['buttons'])})", parse_mode="HTML")
    
    markup = types.InlineKeyboardMarkup()
    markup.row(
        types.InlineKeyboardButton(sc("ADD MORE BUTTON"), callback_data="more_btn_yes", style="success", icon_custom_emoji_id="6154718341672997377"),
        types.InlineKeyboardButton(sc("FINISH & PUBLISH"), callback_data="more_btn_no", style="primary", icon_custom_emoji_id="5303040006347046717")
    )
    bot.send_message(user_id, f"<tg-emoji emoji-id='6154635564768300782'>📌</tg-emoji> <b>{sc('Kya aapko aur bhi buttons add karne hain ya is post ko finalize karein?')}</b>", reply_markup=markup, parse_mode="HTML")

@bot.callback_query_handler(func=lambda call: call.data in ["more_btn_yes", "more_btn_no"])
def more_btn_router(call):
    user_id = call.message.chat.id
    bot.answer_callback_query(call.id)
    if user_id not in temp_data:
        bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>❌</tg-emoji> <b>{sc('Session expired! Please click MAKE POST to create a new post.')}</b>", parse_mode="HTML", reply_markup=main_menu(user_id))
        return
    if call.data == "more_btn_yes":
        ask_for_buttons(user_id)
    else:
        finalize_post(call.message)

def finalize_post(message):
    user_id = message.chat.id
    if user_id not in temp_data:
        return
    data = temp_data.pop(user_id)
    posts_db[data["id"]] = data
    save_posts()
    
    markup = types.InlineKeyboardMarkup()
    for btn in data["buttons"]:
        btn_args = {
            "text": btn["name"], 
            "url": btn["url"],
            "icon_custom_emoji_id": btn["icon_custom_emoji_id"]
        }
        if "style" in btn:
            btn_args["style"] = btn["style"]
        markup.add(types.InlineKeyboardButton(**btn_args))
    
    bot.send_message(user_id, f"<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>{sc('POST CREATED SUCCESSFULLY! UNIQUE POST ID')}</b>: <code>{data['id']}</code>", parse_mode="HTML")
    
    if data["photo_id"]:
        bot.send_photo(user_id, data["photo_id"], caption=data["content"], caption_entities=data["entities"], reply_markup=markup if data["buttons"] else None)
    else:
        bot.send_message(user_id, data["content"], entities=data["entities"], reply_markup=markup if data["buttons"] else None)
        
    complete_text = f"<tg-emoji emoji-id='6154314868150243661'>🎁</tg-emoji> <b>{sc('Aapka post tayar hai! Ab aap niche diye gaye main menu se channel connect karke post bhej sakte hain:')}</b>\n\n<b><b>{sc('DEVELOPER')}</b> : @codevexa</b>"
    try:
        bot.send_photo(user_id, FINAL_IMAGE_URL, caption=complete_text, reply_markup=main_menu(user_id), parse_mode="HTML")
    except:
        bot.send_message(user_id, complete_text, reply_markup=main_menu(user_id), parse_mode="HTML")

# --- CHANNEL & SEND LOGIC ---
def ask_channel_cb(message):
    sent = bot.send_message(
        message.chat.id, 
        f"<tg-emoji emoji-id='5429651785352501917'>↗️</tg-emoji> <b>{sc('PLEASE FORWARD A MESSAGE FROM YOUR CHANNEL OR SEND @username:')}</b>\n\n"
        f"<i>• {sc('Bot ko channel me admin banayein')}\n"
        f"• {sc('Aap khud bhi us channel ke Admin/Owner hone chahiye')}</i>", 
        parse_mode="HTML"
    )
    bot.register_next_step_handler(sent, verify_channel)

def verify_channel(message):
    user_id = message.from_user.id
    if message.forward_from_chat:
        chat_id = message.forward_from_chat.id
    elif message.text:
        chat_id = message.text.strip()
    else:
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>{sc('PLEASE FORWARD A MESSAGE OR SEND A VALID CHANNEL USERNAME.')}</b>", parse_mode="HTML")
        return

    try:
        chat_info = bot.get_chat(chat_id)

        # 1. Check if Bot is admin in the channel
        bot_member = bot.get_chat_member(chat_info.id, bot.get_me().id)
        if bot_member.status not in ['administrator', 'creator']:
            bot.send_message(message.chat.id, f"<tg-emoji emoji-id='5870869476408299692'>😐</tg-emoji> <b>{sc('PROMOTE BOT AS ADMIN IN YOUR CHANNEL FIRST.')}</b>", parse_mode="HTML")
            return

        # 2. Check if user is Admin or Owner/Creator in this specific channel (NO BYPASS)
        user_is_channel_admin = False
        try:
            user_member = bot.get_chat_member(chat_info.id, user_id)
            if user_member.status in ['administrator', 'creator']:
                user_is_channel_admin = True
        except Exception:
            user_is_channel_admin = False

        if not user_is_channel_admin:
            denied_text = (
                f"<tg-emoji emoji-id='5870619152829386951'>🚫</tg-emoji> <b>{sc('YOU ARE NOT ADMIN IN THIS CHANNEL!')}</b>\n\n"
                f"<b>{sc('Aap is channel ke Admin ya Owner nahi hain.')}</b>\n\n"
                f"<i>{sc('Channel connect karne ke liye aapka is channel me Admin ya Owner hona zaroori hai.')}</i>"
            )
            bot.send_message(message.chat.id, denied_text, reply_markup=main_menu(message.chat.id), parse_mode="HTML")
            return

        # Both bot & user verified as admin
        if message.chat.id not in user_channels: 
            user_channels[message.chat.id] = []
        if not any(ch["id"] == chat_info.id for ch in user_channels[message.chat.id]):
            user_channels[message.chat.id].append({"id": chat_info.id, "title": chat_info.title})
            save_user_channels()
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>{sc('CHANNEL CONNECTED SUCCESSFULLY')}</b>: {chat_info.title}", reply_markup=main_menu(message.chat.id), parse_mode="HTML")
    except Exception as e:
        bot.send_message(message.chat.id, f"<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>{sc('CHANNEL NOT FOUND OR PERMISSION DENIED. CHECK USERNAME.')}</b>", parse_mode="HTML")

def ask_post_id_cb(message):
    sent = bot.send_message(message.chat.id, f"<tg-emoji emoji-id='6154659543570714696'>✉</tg-emoji> <b>{sc('PLEASE ENTER YOUR UNIQUE POST ID TO DISPATCH:')}</b>", parse_mode="HTML")
    bot.register_next_step_handler(sent, select_channel)

def select_channel(message):
    user_id = message.chat.id
    if not message.text:
        bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>{sc('❌ PLEASE SEND A VALID POST ID.')}</b>", parse_mode="HTML")
        return
    post_id = message.text.strip().upper()
    if post_id not in posts_db:
        bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>{sc('❌ INVALID POST ID. Pehle MAKE POST se post banayein.')}</b>", parse_mode="HTML")
        return
    if user_id not in user_channels or not user_channels[user_id]:
        bot.send_message(user_id, f"<tg-emoji emoji-id='5870619152829386951'>😶</tg-emoji> <b>{sc('❌ NO CHANNEL CONNECTED YET. Pehle CONNECT CHANNELS se channel connect karein.')}</b>", parse_mode="HTML")
        return

    # Dynamic verify: check if user is STILL admin in their connected channels
    valid_channels = []
    channels_changed = False
    for chan in user_channels[user_id]:
        cid = chan["id"]
        try:
            m = bot.get_chat_member(cid, user_id)
            if m.status in ['administrator', 'creator']:
                valid_channels.append(chan)
            else:
                channels_changed = True
        except Exception:
            channels_changed = True

    if channels_changed:
        user_channels[user_id] = valid_channels
        save_user_channels()

    if not valid_channels:
        bot.send_message(
            user_id, 
            f"<tg-emoji emoji-id='5870619152829386951'>🚫</tg-emoji> <b>{sc('YOU ARE NOT ADMIN IN THIS CHANNEL!')}</b>\n\n"
            f"<b>{sc('Aap kisi bhi connected channel ke admin nahi hain (ya aapko admin se hata diya gaya hai).')}</b>\n"
            f"<i>{sc('Channel me post dispatch karne ke liye aapka us channel me Admin hona zaroori hai.')}</i>", 
            parse_mode="HTML", 
            reply_markup=main_menu(user_id)
        )
        return

    markup = types.InlineKeyboardMarkup()
    for chan in valid_channels:
        markup.add(types.InlineKeyboardButton(text=chan["title"], callback_data=f"send_{post_id}_{chan['id']}", style="primary", icon_custom_emoji_id="6154631793787015439"))
    bot.send_message(user_id, f"<tg-emoji emoji-id='6154635564768300782'>📌</tg-emoji> <b>{sc('SELECT DESTINATION CHANNEL TO PUBLISH:')}</b>", reply_markup=markup, parse_mode="HTML")

@bot.callback_query_handler(func=lambda call: call.data.startswith("send_"))
def perform_send(call):
    parts = call.data.split("_")
    if len(parts) < 3:
        bot.answer_callback_query(call.id, "Invalid action data.", show_alert=True)
        return
    pid = parts[1]
    cid = "_".join(parts[2:])
    user_id = call.from_user.id

    # Strictly verify: User must strictly be admin or creator in the destination channel right now
    user_is_channel_admin = False
    try:
        user_member = bot.get_chat_member(cid, user_id)
        if user_member.status in ['administrator', 'creator']:
            user_is_channel_admin = True
    except Exception:
        user_is_channel_admin = False

    if not user_is_channel_admin:
        # If user was removed as admin from this channel, remove from user_channels
        if user_id in user_channels:
            user_channels[user_id] = [c for c in user_channels[user_id] if str(c.get("id")) != str(cid)]
            save_user_channels()
        bot.answer_callback_query(call.id, sc("YOU ARE NOT ADMIN IN THIS CHANNEL!"), show_alert=True)
        bot.send_message(
            user_id, 
            f"<tg-emoji emoji-id='5870619152829386951'>🚫</tg-emoji> <b>{sc('YOU ARE NOT ADMIN IN THIS CHANNEL!')}</b>\n\n"
            f"<b>{sc('Aap is channel ke admin nahi hain ya aapko admin se hata diya gaya hai.')}</b>\n"
            f"<i>{sc('Is channel me post publish nahi ki ja sakti.')}</i>", 
            parse_mode="HTML",
            reply_markup=main_menu(user_id)
        )
        return

    # Also verify bot is still admin in this channel
    try:
        bot_member = bot.get_chat_member(cid, bot.get_me().id)
        if bot_member.status not in ['administrator', 'creator']:
            bot.answer_callback_query(call.id, sc("Bot is no longer admin in this channel!"), show_alert=True)
            return
    except Exception:
        bot.answer_callback_query(call.id, sc("Channel permission error!"), show_alert=True)
        return

    data = posts_db.get(pid)
    if not data:
        bot.answer_callback_query(call.id, "Post not found or expired.", show_alert=True)
        return
    if data:
        markup = types.InlineKeyboardMarkup()
        for btn in data["buttons"]:
            btn_args = {
                "text": btn["name"], 
                "url": btn["url"],
                "icon_custom_emoji_id": btn["icon_custom_emoji_id"]
            }
            if "style" in btn:
                btn_args["style"] = btn["style"]
            markup.add(types.InlineKeyboardButton(**btn_args))
            
        try:
            if data["photo_id"]: 
                bot.send_photo(
                    cid, 
                    data["photo_id"], 
                    caption=data["content"], 
                    caption_entities=data["entities"], 
                    reply_markup=markup if data["buttons"] else None
                )
            else: 
                bot.send_message(
                    cid, 
                    data["content"], 
                    entities=data["entities"], 
                    reply_markup=markup if data["buttons"] else None
                )
            
            success_text = f"<tg-emoji emoji-id='6154718341672997377'>✔</tg-emoji> <b>{sc('POST PUBLISHED SUCCESSFULLY TO CHANNEL!')}</b>"
            bot.edit_message_text(
                success_text, 
                call.message.chat.id, 
                call.message.message_id, 
                parse_mode="HTML"
            )
        except Exception as e:
            bot.answer_callback_query(call.id, f"Error: {e}", show_alert=True)

print("toxic bot status: active and operational")
bot.infinity_polling()
