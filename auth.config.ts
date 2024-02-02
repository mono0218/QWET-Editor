import { DefaultSession, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { userDB } from "@/lib/user/userDB";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      accessToken: string;
    } & DefaultSession["user"];
  }
}

export const options: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    {
      id: "vroid",
      name: "VRoidHub",
      type: "oauth",
      version: "2.0",
      token: "https://hub.vroid.com/oauth/token",
      userinfo: "https://hub.vroid.com/api/account",
      authorization: {
        url: "https://hub.vroid.com/oauth/authorize",
        params: {
          scope: "default",
          response_type: "code",
          grant_type: "authorization_code",
        },
      },
      httpOptions: {
        headers: {
          "X-Api-Version": 11,
        },
      },

      profile(profile) {
        const userdb = new userDB();

        userdb.upsert({
          id: Number(profile.data.user_detail.user.id),
          name: profile.data.user_detail.user.name,
          url: profile.data.user_detail.user.icon.sq170.url,
        });

        return {
          token: profile.accessToken,
          id: profile.data.user_detail.user.id,
          name: profile.data.user_detail.user.name,
          image: profile.data.user_detail.user.icon.sq170.url,
        };
      },

      clientId: process.env.NEXT_PUBLIC_NEXTAUTH_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_NEXTAUTH_CLIENT_SECRET,
    },
  ],
  callbacks: {
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      if (user) {
        token.user = user;
        const u = user as any;
        token.role = u.role;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.accessToken = token.accessToken as string;
      }
      return {
        ...session,
        user: {
          ...session.user,
        },
      };
    },
  },
};
