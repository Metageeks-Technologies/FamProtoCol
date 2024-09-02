
import { checkBot,getChatMember, sendMessageToGroup, telegramWebHook } from "../../controllers/telegram/telegram";
import express from "express";
import { verifyToken } from "../../middleware/user/verifyToken";

const telegramRouter = express.Router();

telegramRouter.post('/webhook', telegramWebHook);
telegramRouter.get('/getChatMember', getChatMember);
telegramRouter.post('/sendToGroup', sendMessageToGroup);
telegramRouter.get('/checkBot',verifyToken,checkBot);


export default telegramRouter;