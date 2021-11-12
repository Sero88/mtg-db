import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
          }),
    ],
    database: process.env.DATABASE_URL,
    secret: process.env.SECRET,
    callbacks: {
        async signIn(user, account, profile) { 
  
            const allowedEmails = JSON.parse(process.env.ALLOWED_EMAILS);

            const canView = 
                allowedEmails.includes(user.email)
                ? true
                : false;
            
            return canView; 
        },
    },
})