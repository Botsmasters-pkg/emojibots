/*CMD
  command: *
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
var cbData = (typeof data !== "undefined" && data) ? data : 
             ((typeof request !== "undefined" && request && request.data) ? request.data : null);

if (cbData && cbData.indexOf("send_") === 0) {
  var parts = cbData.split("_");
  if (parts.length >= 3) {
    var pid = parts[1];
    var cid = parts.slice(2).join("_");
    
    User.setProperty("exec_pid", pid, "string");
    User.setProperty("exec_cid", cid, "string");
    
    Api.getChatMember({
      chat_id: cid,
      user_id: user.telegramid,
      on_result: "/onVerifySendChannel",
      on_error: "/onVerifySendChannel"
    });
  }
}