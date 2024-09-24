import axios from "axios";
import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";
import TwitterApiBase from "twitter-api-v2/dist/esm/client.base";
import User from "../../models/user/user";
import AuthState from "../../models/authState/authState";
dotenv.config();

const accessToken = process.env.X_ACCESS_TOKEN;
const BearerToken = process.env.TWITTER_BEARER_TOKEN;

const client = new TwitterApi({
  clientId: "UkVZdV8zR2lXczlnejhkVTBDcjY6MTpjaQ" as string,
  clientSecret: "P0Q71rJ1gaGn3x12dV8Y96DeFIlRhPAqLwkC2rWQ_rTFy5H7Sw" as string,
});

export const callbackURL = `${process.env.PUBLIC_CLIENT_URL}/callback`;

export const OAuth2WithTwitter = async (req: any, res: any, next: any) => {
  try {
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      callbackURL,
      {
        scope: [
          "tweet.read",
          "tweet.write",
          "users.read",
          "offline.access",
          "follows.read",
          "like.read",
        ],
      }
    );
    console.log("Generated OAuth2 URL:", url);
    const authState = await AuthState.findOne({ codeVerifier, state });
    if (authState) {
      return res.status(400).json({ success: false, message: "Invalid state" });
    }

    await AuthState.create({ codeVerifier, state });
    res.redirect(url);
  } catch (error) {
    console.error("Error in OAuth2WithTwitter:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while authenticating with Twitter",
    });
  }
};

export const OAuth2WithTwitterCallback = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const LoggedInUser = req.user;
    console.log("Logged in user:", LoggedInUser);
    if (!LoggedInUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    console.log("Request query:", req.query);

    const { state, code } = req.query;
    const data = await AuthState.findOne({ state });
    console.log("Auth state:", data);
    if (!data) {
      return res
        .status(400)
        .send(
          "Invalid code or states, You may changed your browser or request is expired. Please try again."
        );
    }

    const {
      client: loggedClient,
      accessToken,
      refreshToken,
    } = await client.loginWithOAuth2({
      code: code as string,
      codeVerifier: data.codeVerifier as string,
      redirectUri: callbackURL,
    });

    const { data: profile } = await loggedClient.v2.me();

    const { ids } = LoggedInUser;

    const userToUpdate = await User.findById(ids);

    if (!userToUpdate) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    userToUpdate.twitterInfo = {
      twitterId: profile.id,
      username: profile.username,
      profileImageUrl: profile.profile_image_url,
      accessToken,
      refreshToken,
    };

    await userToUpdate.save();
  } catch (error) {
    console.error("Error in OAuth2WithTwitterCallback:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while authenticating with Twitter",
    });
  }
};

export const checkFollow = async (req: any, res: any) => {
  const { targetUserName } = req.body;
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const { refreshToken, twitterId } = user.twitterInfo as any;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated with Twitter",
      });
    }

    const {
      client: loggedClient,
      accessToken,
      refreshToken: newRefreshToken,
    } = await client.refreshOAuth2Token(refreshToken);
    console.log("Refreshed token:", accessToken);
    const userData = await User.findOneAndUpdate(
      { _id: id },
      {
        "twitterInfo.refreshToken": newRefreshToken,
        "twitterInfo.accessToken": accessToken,
      }
    );
    console.log("user", userData);
    const targetUserId = await loggedClient.v2.userByUsername(targetUserName);
    console.log("targetUserId", targetUserId);
    if (!targetUserId) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const follow = await loggedClient.v2.follow(
      twitterId,
      targetUserId.data.id
    );

    console.log("follow", follow);
    return res.status(200).json({ success: true, response: follow.data });
  } catch (error) {
    console.error("Error in checkFollow API:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while checking follow status",
    });
  }
};

export const checkTweetLike = async (req: any, res: any) => {
  const { tweetId } = req.body;
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const { refreshToken, twitterId } = user.twitterInfo as any;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated with Twitter",
      });
    }

    const {
      client: loggedClient,
      accessToken,
      refreshToken: newRefreshToken,
    } = await client.refreshOAuth2Token(refreshToken);
    console.log("Refreshed token:", accessToken);
    await User.findOneAndUpdate(
      { _id: id },
      {
        "twitterInfo.refreshToken": newRefreshToken,
        "twitterInfo.accessToken": accessToken,
      }
    );

    const response = await loggedClient.v2.userLikedTweets(twitterId as string);
    console.log("Response from Twitter API:", response);

    if (!response.data.data) {
      return res.status(200).json({ success: false, isLiked: false });
    }

    let isLiked = false;
    response.data.data.forEach(async (tweet: any) => {
      if (tweet.id === tweetId) {
        isLiked = true;
      }
    });

    return res.status(200).json({ success: true, isLiked });
  } catch (error) {
    console.error("Error in tweetLiked API:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while liking tweet",
    });
  }
};

export const checkTweetRetweet = async (req: any, res: any) => {
  const { tweetId } = req.body;
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const { refreshToken, twitterId } = user.twitterInfo as any;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated with Twitter",
      });
    }

    const {
      client: loggedClient,
      accessToken,
      refreshToken: newRefreshToken,
    } = await client.refreshOAuth2Token(refreshToken);
    console.log("Refreshed token:", accessToken);

    await User.findOneAndUpdate(
      { _id: id },
      {
        "twitterInfo.refreshToken": newRefreshToken,
        "twitterInfo.accessToken": accessToken,
      }
    );

    const response = await loggedClient.v2.tweetRetweetedBy(tweetId as string);
    console.log("Response from Twitter API:", response);
    let isRetweeted = false;
    response?.data?.forEach(async (user: any) => {
      if (user.id === twitterId) {
        isRetweeted = true;
      }
    });
    return res.status(200).json({ success: true, isRetweeted });
  } catch (error) {
    console.error("Error in tweetRetweeted API:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retweeting tweet",
    });
  }
};

export const sendTweet = async (req: any, res: any) => {
  const { id } = req.user;
  const { tweetBody } = req.body;
  if (!tweetBody) {
    return res
      .status(400)
      .json({ success: false, message: "Tweet body not provided" });
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const { refreshToken, twitterId } = user.twitterInfo as any;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated with Twitter",
      });
    }

    const {
      client: loggedClient,
      accessToken,
      refreshToken: newRefreshToken,
    } = await client.refreshOAuth2Token(refreshToken);
    console.log("Refreshed token:", accessToken);

    await User.findOneAndUpdate(
      { _id: id },
      {
        "twitterInfo.refreshToken": newRefreshToken,
        "twitterInfo.accessToken": accessToken,
      }
    );

    const response = await loggedClient.v2.tweet(tweetBody);
    console.log("Response from Twitter API:", response);
    return res.status(200).json({ success: true, tweet: response.data });
  } catch (error) {
    console.error("Error in tweetReplied API:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while replying to tweet",
    });
  }
};
