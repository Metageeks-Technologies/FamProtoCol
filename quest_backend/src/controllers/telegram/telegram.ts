import { tele_api  } from "../../utils/telegramApi";
export const sendMessage = async (chat_id:string,messageText:string) => {
  console.log("sendMessage",chat_id,messageText);
  const api=await tele_api();
  const response = await api.get("sendMessage", {
    chat_id: chat_id,
    text: messageText
  });

  return response.data;
};

export const getChatMember=async (req:any,res:any) => {
  const api=await tele_api();
  const response = await api.get("getChatMember", {
    chat_id: req.query.chatId,
    user_id: req.query.userId
  });

  res.status(200).json(response);
}

const checkMemberCount = async (messageObj: any) => {
  // console.log(messageObj)
  const api=await tele_api();
   const response = await api.get("getChatMemberCount", {
    chat_id: messageObj.chat.id,
  });
  // console.log("response:-",response);
  const memberCount = response.data.result;

  await sendMessage(messageObj, `Member Count: ${memberCount}`);
  return;
}

export const handleMessage = async (messageObj: any) => {
  const messageText = messageObj.text || "";

  if(messageText.charAt(0) === "/"){
    const command = messageText.slice(1);
    switch(command){
      case "start":
        return sendMessage(messageObj.chat.id, "Welcome to the Telegram bot!");
      case "member":
        return checkMemberCount(messageObj);
      default:
        return sendMessage(messageObj, "Unknown command. Please try again.");
    }
  }
}

export const handler=async(req:any)=>{
  const {body}=req; 
  if(body){
    const messageObj=body.message;
    await handleMessage(messageObj);
  }
  return;

}

export const telegramWebHook = async (req: any, res: any) => {
  try{
    console.log(req.body);
    res.send(await handler(req));
  }
  catch(error){
    console.log(error);
    res.sendStatus(500);
  }
}


export const sendMessageToGroup = async (req: any, res: any) => {
 try{
    const {chat_id,messageText}=req.query;
    const response=await sendMessage(chat_id,messageText);
    return res.status(200).send(response);
 }
 catch(error){
   console.log(error);
 }
}