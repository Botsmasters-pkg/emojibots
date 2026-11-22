/*CMD
  command: /start
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
Bot.setProperty("admin_id", adminId, "string");

var users = Bot.getProperty("users") || [];
if (users.indexOf(user.telegramid) === -1) {
  users.push(user.telegramid);
  Bot.setProperty("users", users, "json");
}

var mustJoin = Bot.getProperty("must_join") || Libs.emojiHelper.DEFAULT_MUST_JOIN;

if (mustJoin && mustJoin.length > 0) {
  User.setProperty("fsub_index", 0, "integer");
  Api.getChatMember({
    chat_id: mustJoin[0],
    user_id: user.telegramid,
    on_result: "/onCheckJoinMember",
    on_error: "back_to_main"
  });
  return;
}

Bot.runCommand("back_to_main");