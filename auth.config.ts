import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

const authConfig: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const hardcodedEmail = "admin@gmail.com";
        const hardcodedPassword = "Password";

        if (
          !credentials ||
          credentials.email !== hardcodedEmail ||
          credentials.password !== hardcodedPassword
        ) {
          throw new Error("Invalid email or password");
        }

        
        return {
          id: "1", // Static user ID
          email: hardcodedEmail,
          name: "Admin",
          preferred_name: "Admin",
          role: "admin",
          color: "blue", 
          verified: true, 
        };
      },
    }),
  ],
  pages: {
    signIn: "/", 
  },
};


export default authConfig;
