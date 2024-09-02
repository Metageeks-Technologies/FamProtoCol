import express, {Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import Bottleneck from "bottleneck";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/user/auth";
import kolsRouter from "./routes/kols/kols";
import feedRouter from "./routes/feed/feed.route";
import questsRouter from "./routes/quests/quests.route";
import communityRoute from "./routes/community/community.route";
import adminRoutes from "./routes/admin/admin";
import taskRouter from "./routes/task/task.route";
import userRouter from "./routes/user/user";
import s3routes from "./routes/aws/s3routes";
import grantRouter from "./routes/grants/grant";
import telegramRouter from "./routes/telegram/telegram";
import twitterRouter from "./routes/twitter/twitter";
import passport from "./utils/passport";

dotenv.config();

const port = process.env.PORT || 8080;
const app=express();

app.use(
  cors({
    origin: process.env.PUBLIC_CLIENT_URL,
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
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.session());
app.use(passport.initialize());

// routes
app.use("/feed", feedRouter);
app.use("/quest", questsRouter);
app.use("/community", communityRoute);
app.use("/grant", grantRouter);
app.use("/task", taskRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/kols", kolsRouter);
app.use("/admin", adminRoutes);
app.use("/aws", s3routes);
app.use("/telegram", telegramRouter);
app.use("/twitter", twitterRouter);



const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL || "").then((data: any) => {
      console.log(`Database connected with ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  connectDB();
});
