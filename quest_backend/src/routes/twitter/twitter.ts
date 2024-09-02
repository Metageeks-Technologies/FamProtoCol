import { verifyToken } from "../../middleware/middleware";
import {
  checkFollow,
  checkTweetLike,
  OAuth2WithTwitterCallback,
  OAuth2WithTwitter,
  checkTweetRetweet,
  sendTweet,
} from "../../controllers/twitter/twitter";
import express from "express";

const twitterRouter = express.Router();

twitterRouter.get("/auth", verifyToken, OAuth2WithTwitter);
twitterRouter.get("/auth/callback", verifyToken, OAuth2WithTwitterCallback);
twitterRouter.post("/checkFollow", verifyToken, checkFollow);
twitterRouter.post("/checkLike", verifyToken, checkTweetLike);
twitterRouter.post("/checkRetweet", verifyToken, checkTweetRetweet);
twitterRouter.post("/send", verifyToken, sendTweet);

export default twitterRouter;
