import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import jwt from 'jsonwebtoken';
import { Strategy as DiscordStrategy, Profile as DiscordProfile } from "passport-discord";
import dotenv from "dotenv";
import UserDb, { IUser } from "../models/user/user";
import { Request } from "express";
import KolsDB from "../models/kols/kols";
import { fetchGuilds } from "../controllers/user/discord";
import { jwtUser } from "middleware/user/verifyToken";

dotenv.config();

// Google Authentication
console.log("Google ID",process.env.CLIENT_ID);
console.log("Google Secret",process.env.SECRET_ID);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID || '',
      clientSecret: process.env.SECRET_ID || '',
      callbackURL: `${process.env.PUBLIC_SERVER_URL}/auth/google/callback`,
      passReqToCallback: true,  
    },
    async (req: Request, accessToken: any, refreshToken: any, profile: Profile, done: any) => {
      try {
        const role = req.query.state as string;  
        
        let user;
        
        if (role === 'kol') {
          user = await KolsDB.findOne({ googleId: profile.id });
          if (!user) {
            user = new KolsDB({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails?.[0].value,
              image: profile.photos?.[0].value,
            });
            await user.save();
          }
        } else {
          user = await UserDb.findOne({ googleId: profile.id });

          if (!user) {
            user = new UserDb({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails?.[0].value,
              image: profile.photos?.[0].value,
            });
            await user.save();
          }
        }

        return done(null, user);
      } catch (error) {
        console.error("Error during authentication:", error);
        return done(error);
      }
    }
  )
);

// To show google acces page every time
 
GoogleStrategy.prototype.authorizationParams = function () {
  return {
    access_type: "offline",
    prompt: "consent",
  };
};

// Discord OAUth Authentication

const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

  const secretKey = process.env.JWT_SECRET as string;

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_ID || '', 
      clientSecret: process.env.DISCORD_SECRET_KEY || '',
      callbackURL: `${process.env.PUBLIC_SERVER_URL}/auth/discord/callback`,
      scope: ['identify', 'email', 'guilds', 'guilds.join'],
      passReqToCallback: true,
    },
    async (req: Request, accessToken: string, refreshToken: string, profile: DiscordProfile, done: any) => {
      try {
         
        const token=req.cookies.authToken;
        // console.log("token in discord",token)
        const data= await jwt.verify(token, secretKey);
        const users = data as jwtUser;
        // console.log("sddsdds",users)
        if (!users || !users.ids) {
          return done(new Error( 'User ID not provided'));
        }
    
        // Fetch the user by ID
        let user = await UserDb.findById(users.ids);
        
        if (!user) {
          return done(new Error('User not found'));
        }
        
        // Process user data (fetch user guilds, update database, etc.)
        // console.log("User found:", user);
    
          const guilds = await fetchGuilds(accessToken);
          if (user) {
            user.discordInfo = {
              discordId: profile.id,
              username: profile.username,
              profileImageUrl: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : undefined,
              accessToken: accessToken,
              refreshToken: refreshToken,
              guilds: guilds.length > 0 ? guilds : undefined,
            };
            await user.save();
          } else {
            return done(new Error("User not found"), null);
          }
          return done(null, user);

      } catch (error: any) {
        return done(error);
      }
    }
  )
);

// Telegram Authentication   
// passport.use(
//   new TelegramStrategy(
//     {
//       botToken: "7242549217:AAECE1Do2WkQ2j6r6LwlKbp-dQlG4XzHVqU",
//       callbackURL: `${process.env.PUBLIC_SERVER_URL}/auth/telegram/callback`, 
//       passReqToCallback: true,
//       // Corrected callback URL
//     },
//     async (req:Request,profile: TelegramProfile, done: (error: any, user?: any) => void) => {
//       try {
//         const users = req.user as IUser; // Get the currently logged-in user 
        
//         let user = await UserDb.findById(users._id);  // Find the user in the database
        
//         if (user) {
//           // Update or set Telegram information in the user record
//           user.teleInfo = {
//             telegramId: profile.id,
//             teleName: profile.displayName,
//             teleusername: profile.username,
//           };
//           await user.save(); // Save the updated user record
//           return done(null, user); // Pass the user object to the done callback
//         } else {
//           // Handle the case where the user is not found
//           return done(new Error('User not found'), null);
//         }
//       } catch (error) {
//         console.error('Error during Telegram authentication:', error);
//         return done(error);
//       }
//     }
//   )
// );


// passport.use(new Tele)

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    let user = await UserDb.findById(id)  
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
 
export default passport;
