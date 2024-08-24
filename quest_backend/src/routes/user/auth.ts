import express, { Request, Response } from "express";
import dotenv from "dotenv";
import passport from "../../utils/passport";
import { checkExistingUser, checkIfUserFollows, loginFailed, loginSuccess, logout, updateUser } from "../../controllers/user/auth";
import { isAuthenticated } from "../../middleware/user/authorize.user";
import { TwitterConnected } from "../../middleware/user/twitter";
import { checkGuilds, checkInviteLink, fetchGuildChannelInfo, sendDiscord } from "../../controllers/user/discord";
import UserDb, { IUser } from "../../models/user/user";
import { DiscordConnected } from "../../middleware/user/discord";
import KolsDB from "../../models/kols/kols";
import crypto from 'crypto';
import { checkTelegramId } from "../../middleware/user/telegram";
import { ensureAuthenticated } from "../../middleware/user/discordAuthentication";
import { jwtUser, verifyToken} from "../../middleware/user/verifyToken";
import axios from "axios";
import oauth from 'oauth';
import jwt from 'jsonwebtoken';
interface Guild {
  id: string;
  name?: string; // Optional property
}
dotenv.config();

const authrouter = express.Router();
const TELEGRAM_BOT_TOKEN = process.env.TELE_BOT_TOKEN!;
const SECRET_KEYS = crypto.createHash('sha256').update(TELEGRAM_BOT_TOKEN).digest();
// Google route 

authrouter.get(
  "/google/kol",
  (req, res, next) => {
    req.query.state = 'kol';  
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: 'kol',  
    })(req, res, next);
  }
);

authrouter.get(
  "/google/user",
  (req, res, next) => {
    req.query.state = 'user'; 
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: 'user',  
    })(req, res, next);
  }
);

// Google OAuth callback route 

authrouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.PUBLIC_CLIENT_URL}/failed`,
  }),
  (req, res) => { 
    res.redirect(`${process.env.PUBLIC_CLIENT_URL}/sucessfulLogin`);
  }
);
 

// Connect twitter account  of user and check it is authenticate or not

// authrouter.get(
//   "/twitter", 
//   passport.authenticate("twitter")
// );

// authrouter.get(
//   "/twitter/callback",
//   passport.authenticate("twitter", {
//     successRedirect:`${process.env.PUBLIC_CLIENT_URL}/sucessfulLogin`,
//     failureRedirect: `${process.env.PUBLIC_CLIENT_URL}/failed`,
//      })
// );
const consumerKey = process.env.Twitter_Key!;
const consumerSecret = process.env.Twitter_Secret_key!;
const callbackURL = `${process.env.PUBLIC_SERVER_URL}/auth/twitter/callback`;
const sessionSecret = process.env.JWT_SECRET as string;

const oauthConsumer = new oauth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  consumerKey,
  consumerSecret,
  '1.0A',
  callbackURL,
  'HMAC-SHA1'
);

authrouter.get('/twitter', (req, res) => {
  oauthConsumer.getOAuthRequestToken((error, oauthToken, oauthTokenSecret, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    // console.log('OAuth Request Token:', { oauthToken, oauthTokenSecret });
    // res.cookie('oauthToken', oauthToken, { httpOnly: true });
    // res.cookie('oauthTokenSecret', oauthTokenSecret, { httpOnly: true });
    res.cookie('oauthToken', oauthToken, { httpOnly: true, secure: true, sameSite: 'none' });
    res.cookie('oauthTokenSecret', oauthTokenSecret, { httpOnly: true, secure: true, sameSite: 'none' });
    res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`);
 });
});

authrouter.get('/twitter/callback', (req, res) => {
  const { oauth_token: oauthToken, oauth_verifier: oauthVerifier } = req.query;
  const oauthTokenSecret = req.cookies.oauthTokenSecret;

  // console.log('Received callback with params:', { oauthToken, oauthVerifier, oauthTokenSecret });

  if (!oauthToken || !oauthVerifier || !oauthTokenSecret) {
    console.error('Missing OAuth parameters:', { oauthToken, oauthVerifier, oauthTokenSecret });
    return res.status(401).send({ statusCode: 401, data: 'Request token missing' });
  }
  
  oauthConsumer.getOAuthAccessToken(
    oauthToken as string,
    oauthTokenSecret,
    oauthVerifier as string,
    async (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
      if (error) {
        return res.status(500).send(error);
      }

      const profileUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';
      const profileParams = { include_email: 'true' };

      oauthConsumer.get(
        `${profileUrl}?include_email=true`,
        oauthAccessToken,
        oauthAccessTokenSecret,
        async (error, data, response) => {
          if (error) {
            return res.status(500).send(error);
          }

          const profile = JSON.parse(data as string);
          // console.log("cookies",req.cookies)
          try {
            const tokens = req.cookies.authToken;
            // console.log("twitter",tokens)
            const jwtPayload = jwt.verify(tokens, sessionSecret);
            // console.log(jwtPayload)
            const users = jwtPayload as jwtUser;

            if (!users || !users.ids) {
              return res.status(400).send('User ID not provided');
            }

            let user = await UserDb.findById(users.ids);

            if (!user) {
              return res.status(404).send('User not found');
            }

            user.twitterInfo = {
              twitterId: profile.id,
              username: profile.screen_name,
              profileImageUrl: profile.profile_image_url_https,
              oauthToken: oauthAccessToken,
              oauthTokenSecret: oauthAccessTokenSecret,
            };

            await user.save();
           
            res.redirect(`${process.env.PUBLIC_CLIENT_URL}/sucessfulLogin`);
          } catch (error: any) {
            return res.status(500).send(error);
          }
        }
      );
    }
  );
});
// Connect Discord account  of user and check it is authenticate or not

authrouter.get(
  "/discord",
  passport.authenticate("discord")
);

authrouter.get(
  "/discord/callback",
  passport.authenticate("discord", {
    successRedirect:`${process.env.PUBLIC_CLIENT_URL}/sucessfulLogin`,
    failureRedirect: `${process.env.PUBLIC_CLIENT_URL}/failed`,
     }) 
);
 
authrouter.get('/telegram/callback', verifyToken, async (req, res) => {
  
  try {
    // Extract query parameters from the request
    const { id, first_name, last_name, username, photo_url } = req.query as {
      id: string;
      first_name: string;
      last_name: string;
      username: string;
      photo_url: string;
    };

    console.log("first",id,first_name,last_name,username,photo_url);

    // Optional user verification
    const users = req.user as jwtUser;
    const userId = users.ids;
    console.log("second",userId);
    // Check if user exists in the database
    let userdata = await UserDb.findById(userId);
    // console.log("first",userdata)
    if (!userdata) {
      // User does not exist, respond with 404
      return res.status(404).send({ message: "Invalid user" });
    }

    // Update user details with Telegram data if the fields are provided
    userdata.teleInfo = {
      telegramId: id || userdata.teleInfo?.telegramId,
      teleName: first_name || userdata.teleInfo?.teleName,
      teleusername: username || userdata.teleInfo?.teleusername,
      teleimg: photo_url || userdata.teleInfo?.teleimg,
      telelastname: last_name || userdata.teleInfo?.telelastname,
    };

    await userdata.save();


    return res.status(200).send({ message: "Telegram connected successfully" });
  //  return res.redirect(`${process.env.PUBLIC_CLIENT_URL}/user/profile`);
  } catch (error) {
    console.error("Error during authentication:", error);
    return res.status(500).send({ message: "Try again later" });
  }
});


// Get the Specific user info

authrouter.get( "/twitter/follows/:targetUserId", isAuthenticated, checkIfUserFollows );

// check if user exisit or not
authrouter.post( "/check/user", checkExistingUser );

authrouter.get("/login/success", loginSuccess);

authrouter.get("/login/failed", loginFailed);

// Get User And Kol info  

authrouter.get("/profile",verifyToken, async (req, res) => {
  const user = req.user as any;
   let data;
  if (!user) { return res.status(201).json({success:false, message: "User not found. Please login" });  } 
  data = await UserDb.findById(user.ids); 
  return res.status(200).send(data);
});

// update profile user and Kol

authrouter.put("/profile/update",verifyToken, updateUser );


// logout client
authrouter.get("/logout",verifyToken , logout);

// fetch guiild channel  (DISORD) 

authrouter.get('/fetch-guild/:guildId', async (req: Request, res: Response) => {
  const users=req.body;
  if (!users.discordInfo || !users.discordInfo.accessToken) {
    return res.status(200).send('User does not have a Discord access token');
  }

  const accessToken = users.discordInfo.accessToken;
  try {
    const {guildId } = req.params;

    const channels = await fetchGuildChannelInfo(guildId, accessToken);
    // const channels = guilds.channels;
    if (channels.length === 0) {
      return res.send('User has not joined any guilds');
    }

   
    return res.json({message:channels});  }
   catch (error) {
    console.error('Error fetching guilds:', error);
    return res.status(500).send('Failed to fetch guilds');
  }
});
// Check Guild in user  (DISORD)

authrouter.get('/check-guilds', async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(201).send({success:false,message:'User is not authenticated'});
  }

  const users = req.user as IUser;

  if (!users.discordInfo || !users.discordInfo.accessToken) {
    return res.status(200).send('User does not have a Discord access token');
  }

  const accessToken = users.discordInfo.accessToken;
  try {
    const guilds = await checkGuilds( accessToken);

    return res.status(200).send(guilds);
  } catch (error) {
    console.error('Error fetching guilds:', error);
    return res.status(500).send('Failed to fetch guilds');
  }
});

// Check Invited url is valid or not   (DISORD)
authrouter.post('/check-discord-membership', async (req, res) => {
  const { data, accessToken, guildId } = req.body;
  // console.log("dsd", guildId)
  const userId=data;
  try {
    const isMember = await isUserInGuild(userId, accessToken, guildId);
    res.json({ isMember });
  } catch (error) {
    console.error('Error checking Discord membership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

 

const   isUserInGuild=async(userId:string, accessToken:string, guildId:string)=> {
  try {
    const response = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const guilds = response.data;
    const isMember = guilds.some((guild: Guild) => guild.id === guildId);
     return isMember;
  } catch (error) {
    // console.error('Error fetching user guilds:', error);
    return false;
  }
}
 
authrouter.post('/validate/:inviteUrl', verifyToken,async (req: Request, res: Response) => {
  const user = req.user as any;
  const userExist =await UserDb.findById(user.ids)
  if (!userExist) {
    return res.status(401).send('User is not authenticated');
  }
  if (!userExist.discordInfo || !userExist.discordInfo.accessToken) {
    return res.status(201).send('User does not have a Discord access token');
  }

  try {
    const inviteUrl = decodeURIComponent(req.params.inviteUrl);
    const validLink = await checkInviteLink(inviteUrl);
    if (validLink) {
      res.status(200).json({ success: true, message: 'Valid link and bot is in the guild',validLink });
    } else {
      res.status(200).json({ success: false, message: 'INValid link . bot is not in the guild' });
    }


  } catch (error) {
    console.error('Error fetching guilds:', error);
    return res.status(201).send({ success: false, message:'Failed to fetch guilds'});
  }
});

export default authrouter;
