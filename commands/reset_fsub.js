/*CMD
  command: /reset_fsub
  help: Reset FSub verification status to test force join
  need_reply: false
  auto_retry_time: 
  folder: 
  answer: 
  keyboard: 
  aliases: /test_fsub, reset_fsub, test_fsub
  group: 
CMD*/

User.setProperty("fsub_verified", false, "boolean");
User.setProperty("fsub_verified_fp", "", "string");
Bot.setProperty("fsub_verified_" + user.telegramid, false, "boolean");
Bot.setProperty("fsub_verified_fp_" + user.telegramid, "", "string");
Bot.setProperty("user_left_" + user.telegramid, false, "boolean");

Bot.runCommand("/start");
