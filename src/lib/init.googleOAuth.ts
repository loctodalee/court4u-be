import passport from 'passport';
import prisma from './prisma';
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
        let user = await prisma.users.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prisma.users.create({
            data: {
              email: profile.emails[0].value,
              googleId: profile.id,
              googleAccessToken: accessToken,
              username: profile.displayName,
              avatarUrl: profile.photos[0].value,
              status: 'active',
            },
          });
        } else {
          user = await prisma.users.update({
            where: { googleId: profile.id },
            data: { googleAccessToken: accessToken },
          });
        }

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
