import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import session from "express-session";
import cors from "cors";
import authrouter from "./routes/user/auth";
import passport from "./utils/passport";
import connectDB from "./utils/db";
import kolsRouter from './routes/kols/kols';
import feedRouter from "./routes/feed.route"
import questsRouter from "./routes/quests/quests.route";
import communityRoute from "./routes/community/community.route";
import Bottleneck from "bottleneck";
import adminRoutes from './routes/admin/admin';
import s3routes from "./routes/s3routes";
import taskRouter from "./routes/task/task.route";
import userRouter from "./routes/user/user";
import morgan from "morgan";
import cookieParser from "cookie-parser"
import {auth} from "./utils/fireAdmin"
import UserDb, { generateToken } from "./models/user/user";
import grantRouter from "./routes/grants/grant";
import telegramRouter from "./routes/telegram/telegram";

dotenv.config();
const app: Express = express();
app.use( express.json() );
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.PUBLIC_CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    // allowedHeaders: ['Content-Type', 'Authorization'] // Ensure these headers are allowed
  })
);


// Middleware setup    
app.use(
  session({
    secret: "sswnsnnjdsdfgd",
    resave: false,
    // saveUninitialized: true,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set to true if your site is served over HTTPS
      httpOnly: true,
      sameSite: 'none', // This is important for cross-site requests
    },
  }));

  
  app.use((req, res, next) => {
    // console.log('authToken', req.cookies); // To debug cookie values
    next();
  });

app.use( '/feed', feedRouter );

app.use( "/quest", questsRouter );
app.use( '/community', communityRoute );
app.use("/grant",grantRouter);

app.use('/task', taskRouter)

app.use(passport.initialize());
app.use(passport.session());
// Google auth route
app.use("/auth", authrouter);
app.use("/user", userRouter);
app.use('/kols', kolsRouter);
app.use('/admin', adminRoutes);
app.use('/aws',s3routes);

const verifyPhoneNumberToken = async (idToken:string) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken
  } catch (error) {
    console.error('Error verifying token:', error);
    // Handle the error (e.g., return an unauthorized response)
  }
};

app.post('/api/verify-phone', async(req:Request, res:Response) => {
  const users = req.body;
  // console.log(req.body)
    const idToken=users.idToken;
    const num=users.number;
    const img=users.img;
  const name = users.name;
  // console.log("id token",idToken)
    try {
      const decodedToken = await verifyPhoneNumberToken(idToken); 
      // console.log("decoded Token",decodedToken)
    if (!decodedToken) {
        return res.status(401).send('Authentication failed');
      }    // Generate JWT token 
    let user=await UserDb.findOne({phone_number:num});
    if(!user){
      user=new UserDb({
        phone_number:num,
        displayName:name,
        image:img
      });
      
      await user.save();
      // console.log("created user",user)
    }
    
    const jwtToken = generateToken({
      ids: user._id as string,
      phone_number: user.phone_number
    });
    // console.log("user not",user)
    
    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
      sameSite: "none" as "none"     // path: process.env.CLIENT_URL,
      };
      // console.log("jwtToken:-",jwtToken, "Otiopns:-",options)
      // alert("User Authuthenticaed")
    res.status(200).cookie("authToken", jwtToken, options).json({
      success: true,
      authToken:jwtToken,
      message:"user authenticated succesfully",
    } );
} catch (error) {
  console.error('Error during authentication:', error);
  res.status(401).send('Authentication failed');
}
} );

// TelegramBot;
app.use('/telegram',telegramRouter);
// Example route
app.get('/', (req: Request, res: Response) => {
  
  res.send('Express + TypeScript server');
});
app.get("/greet", (req: Request, res: Response) => {
  res.send("Express + TypeScript server says Hello");
} );

 
// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  connectDB();

} );
