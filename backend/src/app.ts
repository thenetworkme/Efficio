import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import { Strategy as GitHubStrategy } from 'passport-github2';
import authRoutes from './routes/auth';
import settingsRoutes from './routes/settings';
import { supabase } from './lib/supabase';
import { User } from './types/interface';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        'http://localhost:3000/auth/github/callback',
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        const userData: Partial<User> = {
          displayName: profile.displayName || profile.username,
          photos: [{ value: profile.photos?.[0]?.value }],
          emails: profile.emails
            ? [{ value: profile.emails[0].value }]
            : undefined,
        };

        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select()
          .eq('github_id', profile.id)
          .single();
        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user from Supabase:', fetchError);
          return done(fetchError);
        }
        const { data, error } = await supabase
          .from('users')
          .upsert(
            {
              id: existingUser?.id,
              github_id: profile.id,
              username: profile.username,
              display_name: userData.displayName,
              email: profile.emails?.[0]?.value,
              avatar_url: profile.photos?.[0]?.value,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'github_id',
            }
          )
          .select()
          .single();
        if (error) {
          console.error('Error saving user to Supabase:', error);
          return done(error);
        }
        console.log(
          'User saved/updated successfully in Supabase:',
          data.display_name
        );
        return done(null, data);
      } catch (error) {
        console.error('Error in GitHub strategy:', error);
        return done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', id)
      .single();
    if (error) {
      return done(error);
    }
    done(null, data);
  } catch (error) {
    done(error as Error);
  }
});

app.use('/auth', authRoutes);
app.use('/settings', settingsRoutes);

export default app;
