import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    token?: {
      id?: string;
      accessToken?: string;
    };
  }
}
