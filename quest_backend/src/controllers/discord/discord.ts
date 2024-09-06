import { Request, Response } from "express";
import { IUser } from "../../models/user/user";
import dotenv from "dotenv";
import {
  Client,
  GatewayIntentBits,
  TextChannel,
} from "discord.js";
import axios from "axios";
dotenv.config();

// Initialize the Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

interface Guild {
  id: string;
  name?: string; // Optional property
}

client.login(process.env.DISCORD_TOKEN as string);
// Event handler when the client is ready
client.once("ready", () => {
  console.log("Discord bot ready!");
});

// Error handling for the Discord client
client.on("error", (error) => {
  console.error("Discord client error:", error);
});

client.on("shardError", (error) => {
  console.error("WebSocket connection error:", error);
  setTimeout(() => {
    console.log('Retrying WebSocket connection...');
    client.login(process.env.DISCORD_TOKEN); // Re-login to retry
  }, 5000); 
});

client.on('reconnect', () => {
  console.log('Reconnecting to Discord...');
});


// Log in the Discord client with the bot token


export const fetchGuildChannelInfo = async (guildId: string, token: string) => {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/channels`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch guild information: ${response.statusText}`
      );
    }

    const guildInfo = await response.json();
    return guildInfo;
  } catch (error) {
    console.error("Error fetching guild information:", error);
    throw error;
  }
};

export const fetchGuilds = async (token: string) => {
  while (true) {
    try {
      const response = await fetch(
        "https://discord.com/api/v10/users/@me/guilds",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (response.status === 429) {
        // Handle rate limit
        const retryAfter = response.headers.get("Retry-After");
        if (retryAfter) {
          console.warn(`Rate limited. Retrying after ${retryAfter} seconds`);
          await new Promise((resolve) =>
            setTimeout(resolve, parseFloat(retryAfter) * 1000)
          );
        }
        continue;
      }

      if (!response.ok)
        throw new Error(`Failed to fetch guilds: ${response.statusText}`);

      const data = await response.json();
      return data.map((guild: { id: string }) => guild.id);
    } catch (error) {
      console.error("Error fetching guilds:", error);
      throw error;
    }
  }
};

const isBotInGuild = async (guildId: string) => {
  try {
    const guild = await client.guilds.fetch(guildId);
    return !!guild;
  } catch (error) {
    return false;
  }
};

export const checkGuilds = async (token: string): Promise<string[]> => {
  try {
    const userGuilds = await fetchGuilds(token);
    const guildChecks = await Promise.all(
      userGuilds.map(async (guildId: string) => await isBotInGuild(guildId))
    );

    const guildsWithBot = userGuilds.filter(
      (_: any, index: number) => guildChecks[index]
    );
    return guildsWithBot;
  } catch (error) {
    console.error("Error checking guilds:", error);
    throw error;
  }
};

export const sendDiscord = async (channelId: string, message: string) => {
  try {
    const channel = (await client.channels.fetch(channelId)) as TextChannel;
    if (!channel || !channel.isTextBased()) {
      throw new Error("Channel not found or is not a text channel");
    }
    await channel.send(message);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

const extractInviteCode = (inviteUrl: string): string => {
  const match = inviteUrl.match(/discord\.gg\/([a-zA-Z0-9]+)/);
  if (match) {
    return match[1];
  } else {
    throw new Error("Invalid Discord invite URL");
  }
};

// Function to fetch invite details
const fetchInviteDetails = async (inviteCode: string) => {
  const response = await fetch(
    `https://discord.com/api/v10/invites/${inviteCode}`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch invite details: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

// Example usage
export const checkInviteLink = async (inviteUrl: string) => {
  try {
    const inviteCode = extractInviteCode(inviteUrl);
    const inviteDetails = await fetchInviteDetails(inviteCode);
    const checkLink = await isBotInGuild(inviteDetails.guild_id);
    const guilData = inviteDetails.guild_id;
    return { checkLink, guilData };
  } catch (error) {
    return false;
  }
};

// check user join the guild or not
export const checkUserInChannel = async (channelId: string, userId: string) => {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/members`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok)
      throw new Error(
        `Failed to fetch channel members: ${response.statusText}`
      );

    const members = await response.json();
    const isUserInChannel = members.some(
      (member: any) => member.user.id === userId
    );

    // console.log(`Is user ${userId} in channel ${channelId}? ${isUserInChannel}`);
    return isUserInChannel;
  } catch (error) {
    console.error("Error checking user in channel:", error);
    throw error;
  }
};

const isUserInGuild = async (
  userId: string,
  accessToken: string,
  guildId: string
) => {
  try {
    const response = await axios.get(
      "https://discord.com/api/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const guilds = response.data;
    const isMember = guilds.some((guild: Guild) => guild.id === guildId);
    return isMember;
  } catch (error) {
    // console.error('Error fetching user guilds:', error);
    return false;
  }
};

export const checkDiscordMembership = async (req: Request, res: Response) => {
  const { data, accessToken, guildId } = req.body;
  // console.log("dsd", guildId)
  const userId = data;
  try {
    const isMember = await isUserInGuild(userId, accessToken, guildId);
    res.json({ isMember });
  } catch (error) {
    console.error("Error checking Discord membership:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const checkGuild = async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(201)
      .send({ success: false, message: "User is not authenticated" });
  }

  const users = req.user as IUser;

  if (!users.discordInfo || !users.discordInfo.accessToken) {
    return res.status(200).send("User does not have a Discord access token");
  }

  const accessToken = users.discordInfo.accessToken;
  try {
    const guilds = await checkGuilds(accessToken);

    return res.status(200).send(guilds);
  } catch (error) {
    console.error("Error fetching guilds:", error);
    return res.status(500).send("Failed to fetch guilds");
  }
};

export const fetchGuildById = async (req: Request, res: Response) => {
  const users = req.body;
  if (!users.discordInfo || !users.discordInfo.accessToken) {
    return res.status(200).send("User does not have a Discord access token");
  }

  const accessToken = users.discordInfo.accessToken;
  try {
    const { guildId } = req.params;

    const channels = await fetchGuildChannelInfo(guildId, accessToken);
    // const channels = guilds.channels;
    if (channels.length === 0) {
      return res.send("User has not joined any guilds");
    }

    return res.json({ message: channels });
  } catch (error) {
    console.error("Error fetching guilds:", error);
    return res.status(500).send("Failed to fetch guilds");
  }
};
