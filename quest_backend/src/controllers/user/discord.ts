import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../../models/user/user'; 
import dotenv from "dotenv";
import { ChannelType, Client, DiscordAPIError, GatewayIntentBits, TextChannel } from 'discord.js';
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

// Event handler when the client is ready 
client.once('ready', () => {
  console.log('Discord bot ready!');
});

// Error handling for the Discord client 
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

 

client.on('shardError', (error) => {
  console.error('WebSocket connection error:', error);
});

// Log in the Discord client with the bot token 
client.login(process.env.DISCORD_TOKEN as string);



export const fetchGuildChannelInfo = async (guildId: string, token: string) => {
   

  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,  
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch guild information: ${response.statusText}`);
    }

    const guildInfo = await response.json();
    return guildInfo;
  } catch (error) {
    console.error('Error fetching guild information:', error);
    throw error;  
  }
};

export const fetchGuilds = async (token: string) => {
  while (true) {
    try {
      const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials:'include'
      });

      if (response.status === 429) {
        // Handle rate limit
        const retryAfter = response.headers.get('Retry-After');
        if (retryAfter) {
          console.warn(`Rate limited. Retrying after ${retryAfter} seconds`);
          await new Promise(resolve => setTimeout(resolve, parseFloat(retryAfter) * 1000));
        }
        continue;   
      }

      if (!response.ok) throw new Error(`Failed to fetch guilds: ${response.statusText}`);

      const data = await response.json();
      return data.map((guild: { id: string }) => guild.id);  } catch (error) {
        console.error('Error fetching guilds:', error);
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
      const guildChecks = await Promise.all(userGuilds.map(async (guildId: string) => await isBotInGuild(guildId)));
    
      const guildsWithBot = userGuilds.filter((_:any, index: number) => guildChecks[index]);
      return guildsWithBot; 
    } catch (error) {
      console.error('Error checking guilds:', error);
      throw error;
    }
  };

  

export const sendDiscord = async (channelId: string, message: string) => {
    try {
      const channel = await client.channels.fetch(channelId) as TextChannel;
      if (!channel || !channel.isTextBased()) {
        throw new Error('Channel not found or is not a text channel');
      }
        await channel.send(message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

const extractInviteCode = (inviteUrl: string): string => {
    const match = inviteUrl.match(/discord\.gg\/([a-zA-Z0-9]+)/);
    if (match) {
      return match[1];
    } else {
      throw new Error('Invalid Discord invite URL');
    }
  };
  
  // Function to fetch invite details
  const fetchInviteDetails = async (inviteCode: string) => {
    const response = await fetch(`https://discord.com/api/v10/invites/${inviteCode}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      },
    });
  
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
      const guilData=inviteDetails.guild_id;
      return {checkLink,guilData};
    } catch (error) {
      return false
    }
  };
 
  // check user join the guild or not 
export const checkUserInChannel = async (channelId: string, userId: string) => {
    try {
      const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/members`, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
        credentials:'include'
      });
  
      if (!response.ok) throw new Error(`Failed to fetch channel members: ${response.statusText}`);
  
      const members = await response.json();
      const isUserInChannel = members.some((member: any) => member.user.id === userId);
  
      // console.log(`Is user ${userId} in channel ${channelId}? ${isUserInChannel}`);
      return isUserInChannel;
    } catch (error) {
      console.error('Error checking user in channel:', error);
      throw error;
    }
  };