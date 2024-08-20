import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import 'dotenv/config';

const verifyToken = ClerkExpressWithAuth({
  jwtKey: process.env.CLERK_JWT_SECRET,
  authorizedParties: ["http://localhost:3000"],
  signInUrl: "/",
  onError: () => {console.log("something went wrong")}
});

export default verifyToken;
