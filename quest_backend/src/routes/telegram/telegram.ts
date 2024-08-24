
import { getChatMember, sendMessageToGroup, telegramWebHook } from "../../controllers/telegram/telegram";
import express from "express";

const telegramRouter = express.Router();

telegramRouter.post('/webhook', telegramWebHook);
telegramRouter.get('/getChatMember', getChatMember);
telegramRouter.post('/sendToGroup', sendMessageToGroup);


export default telegramRouter;