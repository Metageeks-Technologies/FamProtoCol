import express from "express";
import dotenv from "dotenv";
import passport from "../../utils/passport";
import crypto from "crypto";
import { verifyToken } from "../../middleware/middleware";
import {
  checkExistingUser,
  loginFailed,
  loginSuccess,
  logout,
  telegramCallback,
  verifyPhone,
} from "../../controllers/user/auth";
import {
  checkDiscordMembership,
  checkUserGuilds,
  fetchGuildChannel,
  inviteLink,
} from "../../controllers/discord/discord";

dotenv.config();

const authRouter = express.Router();
const TELEGRAM_BOT_TOKEN = process.env.TELE_BOT_TOKEN!;
const SECRET_KEYS = crypto
  .createHash("sha256")
  .update(TELEGRAM_BOT_TOKEN)
  .digest();
// Google route

authRouter.get("/google/kol", (req, res, next) => {
  req.query.state = "kol";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "kol",
  })(req, res, next);
});

authRouter.get("/google/user", (req, res, next) => {
  req.query.state = "user";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "user",
  })(req, res, next);
});

// Google OAuth callback route

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.PUBLIC_CLIENT_URL}/failed`,
  }),
  (req, res) => {
    res.redirect(`${process.env.PUBLIC_CLIENT_URL}/sucessfulLogin`);
  }
);

// Connect Discord account  of user and check it is authenticate or not

authRouter.get("/discord", passport.authenticate("discord"));

authRouter.get(
  "/discord/callback",
  passport.authenticate("discord", {
    successRedirect: `${process.env.PUBLIC_CLIENT_URL}/sucessfulLogin`,
    failureRedirect: `${process.env.PUBLIC_CLIENT_URL}/failed`,
  })
);

authRouter.get("/telegram/callback", verifyToken, telegramCallback);
authRouter.post("/check/user", checkExistingUser);
authRouter.get("/login/success", loginSuccess);
authRouter.get("/login/failed", loginFailed);
authRouter.get("/logout", verifyToken, logout);
authRouter.get("/fetch-guild/:guildId", fetchGuildChannel);
authRouter.get("/check-guilds", checkUserGuilds);
authRouter.post("/check-discord-membership", checkDiscordMembership);
authRouter.post("/validate/:inviteUrl", verifyToken, inviteLink);
authRouter.post("/verify-phone", verifyPhone);

export default authRouter;
