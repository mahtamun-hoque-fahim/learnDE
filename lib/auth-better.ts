import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

/**
 * Better Auth Instance
 * Self-hosted, TypeScript-first authentication
 * 
 * Docs: https://better-auth.com/docs
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  // Email & Password auth
  emailAndPassword: {
    enabled: true,
    autoSignUpEnabled: true, // Allow sign-up with email/password
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session timestamp every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // Callbacks for custom logic
  callbacks: {
    /**
     * Called when user signs up
     * Used to redirect to role selection
     */
    async signUpSuccessful({ user }) {
      // User created, next: role selection
      return {
        user,
      }
    },

    /**
     * Called on each auth check
     * Attach role to session
     */
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: user.role as "student" | "staff" | "admin" | null,
        },
      }
    },
  },

  // Plugins for extended functionality
  plugins: [],

  // Trust proxy when behind reverse proxy (Vercel, etc.)
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],
});

// Export types for client usage
export type Session = typeof auth.$Inferred.Session
