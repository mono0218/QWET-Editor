import NextAuth from "next-auth";
import { options } from "../../../../../auth.config";

const handler = NextAuth(options);

export { handler as GET, handler as POST };
