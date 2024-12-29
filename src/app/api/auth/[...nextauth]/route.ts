import NextAuth from "next-auth/next";
import { authOptions } from "./option";

const handler = NextAuth(authOptions)

//in files me koi bhi method likhlo nhi chlega kyoki framework hai,jb route.ts ko likhte hai to get post ye sari verbs likhni pdti hai
export {handler as GET,handler as POST}
