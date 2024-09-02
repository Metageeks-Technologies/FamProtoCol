// import { Strategy as PassportStrategy } from 'passport-strategy';
// import crypto from 'crypto';
// import { Request } from 'express';
// declare module 'passport-strategy' {
//     interface Strategy {
//       name?: string;
//     }
//   }
// interface StrategyOptions {
//   botToken: string;
//   passReqToCallback?: boolean;
//   oauthVerifyCompatible?: boolean;
// }

// interface AuthData {
//   username?: string;
//   auth_date?: string;
//   first_name?: string;
//   last_name?: string;
//   photo_url?: string;
//   id: string;
// }

// const AUTH_KEYS: Record<string, boolean> = {
//   'username': true,
//   'auth_date': true,
//   'first_name': true,
//   'last_name': true,
//   'photo_url': true,
//   'id': true
// };

// class Strategy extends PassportStrategy {
//   private _verify: Function;
//   private _botToken: string;
//   private _passReqToCallback: boolean;
//   private _oauthVerifyCompatible: boolean;

//   constructor(options: StrategyOptions, verify: Function) {
//     super();
//     this.name = 'telegram-login';
//     this._verify = verify;
//     this._botToken = options.botToken;
//     this._passReqToCallback = options.passReqToCallback || false;
//     this._oauthVerifyCompatible = options.oauthVerifyCompatible || false;
//   }

//   authenticate(req: Request) {
//     const { hash, ...authData } = req.query;
    
//     const pairs: string[] = [];

//     const authData: { [key: string]: any } = { /* your auth data here */ };
//     const pairs: string[] = [];

//         for (const key in authData) {
//         if (authData.hasOwnProperty(key) && AUTH_KEYS[key]) {
//             // Correctly using template literals with backticks
//             pairs.push(${key}=${authData[key]});
//         }
//         }
//     pairs.sort();
//     const dataCheckString = pairs.join('\n');
//     const sha256Hash = crypto.createHash('sha256');
//     sha256Hash.update(this._botToken);
//     const secretKey = sha256Hash.digest();
//     const hmac = crypto.createHmac('sha256', secretKey);
//     hmac.update(dataCheckString);
//     const calculatedHash = hmac.digest('hex').toLowerCase();

//     if (calculatedHash !== hash) {
//       return this.fail(401);
//     }

//     if (((new Date().getTime() / 1000) - parseInt(authData['auth_date'])) > 86400) {
//       return this.fail(401);
//     }

//     const profile = this.buildProfile(authData);
//     profile.provider = this.name;
//     profile._json = authData;
//     profile._raw = req.query;

//     const verified = (err: any, user?: any, info?: any) => {
//       if (err) { return this.error(err); }
//       this.success(user, info);
//     };

//     if (this._verify) {
//       const args = [profile, verified];
//       if (this._oauthVerifyCompatible) {
//         args.unshift(null, null);
//       }
//       if (this._passReqToCallback) {
//         args.unshift(req);
//       }
//       this._verify(...args);
//     } else {
//       this.success(profile);
//     }
//   }

//   buildProfile(json: AuthData) {
//     const profile: any = {};

//     profile.id = json.id;
//     profile.displayName = json.last_name ? `${json.first_name} ${json.last_name}` : json.first_name;
//     profile.name = { familyName: json.last_name, givenName: json.first_name };

//     if (json.username) {
//       profile.username = json.username;
//       profile.profileUrl = `https://t.me/${json.username}`;
//     } else {
//       profile.username = profile.displayName;
//     }

//     if (json.photo_url) {
//       profile.photos = [json.photo_url];
//     }
//     return profile;
//   }
// }

// export default Strategy;