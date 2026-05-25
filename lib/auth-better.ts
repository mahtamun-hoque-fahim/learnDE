import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"
import * as schema from "./db/schema"

/**
 * Better Auth instance.
 * Self-hosted, session-based, email/password authentication.
 * Docs: https://better-auth.com/docs
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true, // our tables are `users`, `sessions`, `accounts`, `verifications`
  }),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh every 24h
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // Adds `role` to the users table and exposes it on session.user
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
        input: false, // can't be set during sign-up; promote via SQL or /api/auth/set-role
      },
    },
  },

  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],
})

export type Session = typeof auth.$Infer.Session
