import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export const authOptions : NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Demo",
      credentials: {},
      async authorize() {
        // Always creates a new demo user for each session
        const email = `demo_${randomUUID()}@demo.local`;
        const user = await prisma.user.create({
          data: {
            email,
            name: "Demo User",
            tier: "DEMO",
            isDemo: true,
            provider: "demo",
          },
        });
        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user, token }) {
      // Attach the user's id/tier to the session object
      if (session.user) {
        session.user.id = user?.id ?? token?.sub;
        session.user.tier = user?.tier ?? token?.tier;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
