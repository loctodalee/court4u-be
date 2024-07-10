import passport from 'passport';
import prisma from './prisma';
import { IUserService } from '../service/interface/iUser.service';
import { UserService } from '../service/user.service';

const FacebookStrategy = require('passport-facebook').Strategy;
const host = process.env.HOST;
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${host}/api/auth/facebook/callback`,
      profileFields: ['id', 'email', 'name', 'displayName', 'photos'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        var _userService: IUserService = new UserService();
        let user = await _userService.createOrUpdateFacebookUser({
          avatarUrl: profile.photos[0].value,
          email: profile.emails[0].value,
          facebookAccessToken: accessToken,
          facebookId: profile.id,
          fullname: profile.displayName,
        });
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
