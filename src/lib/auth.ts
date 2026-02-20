import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        console.log("auth called", {
          email: credentials.email,
          pass: credentials.password,
        });

        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`;

        try {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const response = await res.json();

          console.log("login respose", response);
          // console.log("response", response);
          if (!res.ok || !response?.status) {
            throw new Error(response?.message || "Login failed");
          }
          if (response.data.user.role === "USER") {
            // console.log("xxx")
            throw new Error("Only admin can access this page");
          }
          const { user, accessToken } = response.data;

          return {
            id: user._id,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            accessToken,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Authentication failed. Please try again.";
          throw new Error(errorMessage);
        }
      },
    }),
  ],

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.profileImage = user.profileImage;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: JWT }) {
      session.user = {
        id: token.id,
        email: token.email,
        role: token.role,
        profileImage: token.profileImage,
        accessToken: token.accessToken,
      };
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always send authenticated admins to dashboard
      if (url.startsWith("/dashboard")) return `${baseUrl}${url}`;
      // If coming from login or root, go to dashboard
      try {
        const target = new URL(url, baseUrl);
        if (["/", "/login"].includes(target.pathname)) {
          return `${baseUrl}/dashboard`;
        }
      } catch {
        // ignore parse errors and fall through
      }
      return url.startsWith("/") ? `${baseUrl}${url}` : url;
    },
  },
};
