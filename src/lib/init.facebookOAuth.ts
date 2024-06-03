import passport from 'passport';
import prisma from './prisma';

const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/v1/api/auth/facebook/callback',
      profileFields: ['id', 'email', 'name', 'displayName', 'photos'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        let user = await prisma.users.findUnique({
          where: { googleId: profile.id },
        });
        console.log(profile);

        if (!user) {
          user = await prisma.users.create({
            data: {
              email: profile.emails && profile.emails[0].value,
              facebookId: profile.id,
              facebookAccessToken: accessToken,
              username: profile.displayName,
              avatarUrl: profile.photos && profile.photos[0].value,
              status: 'active',
            },
          });
        } else {
          user = await prisma.users.update({
            where: { facebookId: profile.id },
            data: { facebookAccessToken: accessToken },
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
