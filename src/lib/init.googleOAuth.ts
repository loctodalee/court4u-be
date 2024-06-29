import passport from 'passport';
import prisma from './prisma';
import { IUserService } from '../service/interface/iUser.service';
import { UserService } from '../service/user.service';
import { users } from '@prisma/client';
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/v1/api/auth/google/callback',
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        var _userService: IUserService = UserService.getInstance();
        let user = await _userService.createOrUpdateGoogleUser({
          avatarUrl: profile.photos[0].value,
          email: profile.emails[0].value,
          googleAccessToken: accessToken,
          googleId: profile.id,
          fullname: profile.displayName,
        });

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.users.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
export default passport;
