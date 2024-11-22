import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import authRouter from "./routes/auth/auth";
import passport from "./utils/passport";
import kolsRouter from "./routes/kols/kols";
import feedRouter from "./routes/feed/feed";
import questsRouter from "./routes/quests/quest";
import communityRoute from "./routes/community/community";
import Bottleneck from "bottleneck";
import adminRoutes from "./routes/admin/admin";
import s3routes from "./routes/aws/s3routes";
import taskRouter from "./routes/task/task";
import userRouter from "./routes/user/user";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import grantRouter from "./routes/grants/grant";
import telegramRouter from "./routes/telegram/telegram";
import twitterRouter from "./routes/twitter/twitter";
import referralRouter from "./routes/mintingReferral/mintingReferrals";

dotenv.config();
const port = process.env.PORT || 8080;
const databaseUrl: string = process.env.DB_URL || "";
const allowedOrigins = [
  process.env.PUBLIC_CLIENT_URL || "", // Use an empty string or some default value if it's undefined
  process.env.PUBLIC_CLIENT_URL2 || "", // Use an empty string or some default value if it's undefined
];

const app: Express = express();


console.log(JSON.stringify(process.env))

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins.filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    // allowedHeaders: ['Content-Type', 'Authorization'] // Ensure these headers are allowed
  })
);
app.use(
  session({
    secret: "sswnsnnjdsdfgd",
    resave: false,
    // saveUninitialized: true,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true if your site is served over HTTPS
      httpOnly: true,
      sameSite: "none", // This is important for cross-site requests
    },
  })
);

//routes
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/kols", kolsRouter);
app.use("/admin", adminRoutes);
app.use("/aws", s3routes);
app.use("/feed", feedRouter);
app.use("/quest", questsRouter);
app.use("/community", communityRoute);
app.use("/grant", grantRouter);
app.use("/task", taskRouter);
app.use("/telegram", telegramRouter);
app.use("/twitter", twitterRouter);
app.use("/referral",referralRouter);
// Example route
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript server");
});

app.get("/greet", (req: Request, res: Response) => {
  res.send("Express + TypeScript server says Hello");
});

const connectDB = async () => {
  try {
    await mongoose.connect(databaseUrl).then((data: any) => {
      console.log(`Database connected with ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  connectDB();
});
