declare module 'passport-telegram-official' {
  import { Strategy } from 'passport';
  import { Profile } from 'passport';

  export interface TelegramProfile extends Profile {
    id: string;
    displayName: string;
    username?: string;
    photoURL?: string;
  }

  export default class TelegramStrategy extends Strategy {
    constructor(options: TelegramOptions, verify: (profile: TelegramProfile, done: (error: any, user?: any) => void) => void);
  }

  export interface TelegramOptions {
    botToken: string;
    scope?: string[];
  }
}
