import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UserRepository, type User } from "@/modules/user/repository/user.repository";
import { env } from "@/core/config/env";

const userRepository = new UserRepository();
const adminAllowlist = new Set(
  (env.ADMIN_EMAIL_ALLOWLIST ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0)
);

const getRoleByEmail = (email: string): User["role"] =>
  adminAllowlist.has(email.toLowerCase()) ? "admin" : "user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  secret: env.AUTH_JWT_SECRET,
  ...(env.AUTH_COOKIE_NAME
    ? {
        cookies: {
          sessionToken: {
            name: env.AUTH_COOKIE_NAME,
            options: {
              httpOnly: true,
              sameSite: "lax",
              path: "/",
              secure: process.env.NODE_ENV === "production",
            },
          },
        },
      }
    : {}),
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        const targetRole = getRoleByEmail(user.email);
        const existingUser = await userRepository.findByEmail(user.email);
        if (!existingUser) {
          await userRepository.create(
            {
              name: user.name || "User",
              email: user.email,
              avatar: user.image || "",
              role: targetRole,
            },
            user.id
          );
        } else if (existingUser.role !== targetRole && existingUser.id) {
          await userRepository.update(existingUser.id, { role: targetRole });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user && user.email) {
        const dbUser = await userRepository.findByEmail(user.email);
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        } else {
          token.role = getRoleByEmail(user.email);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id && token.role) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
