import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

interface DBUser {
    _id: string;
    email: string;
    username: string;
    password: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                emailOrUsername: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.emailOrUsername || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                await dbConnect();

                const user = await UserModel.findOne<DBUser>({
                    $or: [
                        { email: credentials.emailOrUsername },
                        { username: credentials.emailOrUsername },
                    ],
                });

                if (!user) {
                    throw new Error("No user found with this email/username");
                }

                if (!user.isVerified) {
                    throw new Error("Please verify your account before login");
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password
                );
                if (!isPasswordCorrect) {
                    throw new Error("Incorrect password");
                }

                return {
                    ...user,
                    id: user._id,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user._id = token._id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
                session.user.username = token.username as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};