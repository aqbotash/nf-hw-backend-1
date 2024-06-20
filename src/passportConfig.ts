import passport from 'passport';
import { Strategy as BitbucketStrategy } from 'passport-bitbucket-oauth2';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

passport.use(new BitbucketStrategy({
  clientID: process.env.BITBUCKET_CLIENT_ID!,
  clientSecret: process.env.BITBUCKET_CLIENT_SECRET!,
  callbackURL: "http://localhost:8080/auth/bitbucket/callback"
}, (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
  // Here you can store accessToken and refreshToken in the profile or a session
  profile.accessToken = accessToken;
  profile.refreshToken = refreshToken;
  return done(null, profile);
}));

export default passport;
