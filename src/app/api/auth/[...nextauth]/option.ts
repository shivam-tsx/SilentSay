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
    //providers ke andr provider strategy deni hoti hai ,github(isme bs secret dalne hote hai) ka ya credential provider
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            //authorize krne ki strategy hai which is made by us not required for other providers
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                await dbConnect();

                const user = await UserModel.findOne<DBUser>({
                    $or: [
                        { email: credentials.email },
                        { username: credentials.email },
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
    //callbacks ko modify kra kyoki bar bar database me query na lagani pde 
    callbacks: {
        //user se info token me shift krdi
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        //token se session me shift krdia
        async session({ session, token }) {
            if (session.user && token) {
                session.user._id = token._id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
                session.user.username = token.username as string;
            }
            return session;
        },
        //ab chaye token ka access mile ya session ka mil jaye usme se direct values nikal lenge
    },
    // nextauth ke jo pages hote hai auth/signin is trh hai, we have customize it
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt", //databse ki bhi hoti hai
    },
    secret: process.env.NEXTAUTH_SECRET,
};