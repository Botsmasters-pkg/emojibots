# ⚡ TOXIC ADVANCED EMOJI & POST BUILDER BOT (.bb) ⚡

**Platform:** Bots.Business (BJS) Git-Sync  
**Branding:** `ᴛᴏxɪᴄ` (TOXIC)  
**Developer Credit:** `@codevexa`  
**Bot Admin ID:** `8710308658`  
**Required Force Join Channels:** Configurable dynamically via Admin Panel (`must_join`)  

---

## 🌟 100% 1:1 Match with Python Architecture

All features from the Python script have been reproduced in Bots.Business BJS format:

1. **Inline Button Styling & Custom Emoji Icons:**
   - Exact Telegram 7.0+ Inline Button styles: `primary`, `success`, `danger`.
   - Exact custom animated emoji icons on buttons (`icon_custom_emoji_id`).
   - Small Caps typography (`sc(...)`) across all menus and text prompts.

2. **Animated Premium Custom Emojis:**
   - Automatically wraps standard text emojis with `<tg-emoji emoji-id="...">✨</tg-emoji>`.
   - Dynamic emoji rotation and pool management (`emoji_db`).

3. **Strict Channel Administrator Check (Security):**
   - **Zero-Bypass:** Only users who are `administrator` or `creator` of the target channel can connect it.
   - If not admin:  
     `<tg-emoji emoji-id='5870619152829386951'>🚫</tg-emoji> <b>YOU ARE NOT ADMIN IN THIS CHANNEL!</b>`
   - **Dynamic Re-Check on Send:** Re-checks user status before publishing. If admin was revoked, channel is automatically removed from user list!

4. **Multi-Channel Mandatory Force Join (Public, Private, & Join Request):**
   - Supports adding Public Channels (`@username` or link).
   - Supports adding Private Channels (`-100...` Chat ID + Private Invite Link).
   - Supports adding Private Request Channels (with Telegram `chat_join_request` automatic verification).
   - Admin Panel management: Add / Remove / List force join channels with full details.

5. **Channel Control Suite (Live Auto-Sync):**
   - Automatically detects whenever the bot is promoted as an Administrator in any channel (`my_chat_member`).
   - Sends real-time notification to the Bot Owner (`8710308658`) with clickable channel name and management button.
   - Automatically cleans and removes channels if the bot is removed as admin.
   - **Full Management per Channel:**
     - 🔗 **Get Link:** Exports and displays direct channel invite link.
     - 🛡️ **Status:** Shows live permissions checklist (`can_promote_members`, `can_post_messages`, etc.) with `true` / `false`.
     - ⬆️ **Promote:** Promote any user to channel Administrator directly from the bot.
     - ⬇️ **Demote:** Revoke admin rights from any administrator.
     - ✉️ **Send Message:** Dispatch custom messages directly into the channel.
     - 🗑️ **Delete Message:** Delete any post by providing its Post Link or Message ID.

6. **Dynamic Cloned Bot Identity Auto-Detection:**
   - Detects the bot's Telegram Username, Display Title, and Telegram ID automatically via `Api.getMe()` using whatever bot token is configured in Bots.Business.
   - Allows users to clone the bot (via `/41` or repository clone), set their own token, and operate seamlessly under their own bot username without hardcoding or name conflicts.
   - Includes manual one-click sync button in Admin Panel: `[ 🔄 SYNC BOT TOKEN ]`.

7. **Owner Admin Suite (`8710308658`):**
   - System Analytics & Status Dashboard (with live Bot Identity).
   - Text & Media Broadcast.
   - Add / Remove / List Text & Button Custom Emojis.
   - Multi-Type Force Join Channel Management (Public, Private, Request).
   - Channel Control Dashboard.
   - Clean Database & Export Users List.

---

## 🚀 How to Import into Bots.Business via Git-Sync

1. Push this folder to your GitHub repository.
2. In the [Bots.Business](https://bots.business/) App or Web Dashboard:
   - Go to your bot settings ➡️ **Git**.
   - Connect your GitHub repository.
   - Tap **Sync**.
3. All 86 commands in `commands/` and the `emojiHelper` library in `libs/` will be imported automatically!

---
👨‍💻 **Developer:** [@codevexa](https://t.me/codevexa)  
⚡ **Branding:** ᴛᴏxɪᴄ