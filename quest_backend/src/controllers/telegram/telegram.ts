import { tele_api } from "../../utils/telegramApi";
export const sendMessage = async (chat_id: string, messageText: string) => {
  console.log("sendMessage", chat_id, messageText);
  const api = await tele_api();
  const response = await api.get("sendMessage", {
    chat_id: chat_id,
    text: messageText,
  });

  return response.data;
};

export const getChatMember = async (req: any, res: any) => {

  try{
     const api = await tele_api();
      const chatId = req.query.chat_id;
      const userId = req.query.user_id;
      console.log(chatId, userId);
      const response = await api.get("getChatMember", {
        chat_id: chatId,
        user_id: userId,
      });

      console.log("response",response);
      if(response.data.result.status === "member" || response.data.result.status === "administrator" || response.data.result.status === "creator" ){
        return res.send({success:true, message: "User is a member of the group" });
      }
      else{
        return res.send({success:false, message: "User is not a member of the group" });
      } 
  }
  catch(error){
    console.log(error);
    return res.send({success:false, message: "Something Wrong" });
  }
 
};

const checkMemberCount = async (messageObj: any) => {
  // console.log(messageObj)
  const api = await tele_api();
  const response = await api.get("getChatMemberCount", {
    chat_id: messageObj.chat.id,
  });
  // console.log("response:-",response);
  const memberCount = response.data.result;

  await sendMessage(messageObj, `Member Count: ${memberCount}`);
  return;
};

export const handleMessage = async (messageObj: any) => {
  const messageText = messageObj.text || "";

  if (messageText.charAt(0) === "/") {
    const command = messageText.slice(1);
    switch (command) {
      case "start":
        return sendMessage(messageObj.chat.id, "Welcome to the Telegram bot!");
      case "member":
        return checkMemberCount(messageObj);
      default:
        return sendMessage(messageObj, "Unknown command. Please try again.");
    }
  }
};

export const handler = async (req: any) => {
  const { body } = req;
  if (body) {
    const messageObj = body.message;
    await handleMessage(messageObj);
  }
  return;
};

export const telegramWebHook = async (req: any, res: any) => {
  try {
    console.log(req.body);
    return res.send(await handler(req));
  } catch (error) {
    console.log(error);
    return res.send({ status: 500, message: "Internal Server Error" });
  }
};

export const sendMessageToGroup = async (req: any, res: any) => {
  try {
    const { chat_id, messageText } = req.query;
    const response = await sendMessage(chat_id, messageText);
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.send({ status: 500, message: "Internal Server Error" });
  }
};

export const checkBot = async (req: any, res: any) => {
  try {
    const chatId = req.query.chat_id;
    const BotId = process.env.TELE_BOT_ID;
    console.log(chatId, BotId);
    const api = await tele_api();
    const response = await api.get("getChatMember", {
      chat_id: chatId,
      user_id: BotId,
    });
    console.log(response);
    return res.send({ success:true , message: "Bot is added in the group" });
  } catch (error) {
    console.log(error);
    return res.send({ success:false, message: "Bot is not added in the Group " });
  }
};
