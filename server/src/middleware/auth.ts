import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import 'dotenv/config';

const verifyToken = ClerkExpressWithAuth({
  jwtKey: process.env.CLERK_JWT_SECRET,
  authorizedParties: [
    "http://localhost:3000",
    "https://resumegpt-client.fly.dev",
    "https://resumegpt-client-dev.fly.dev",
    "https://resumetitan.com"
  ],
  signInUrl: "/",
  onError: (err) => {
    console.error("Auth error:", err);
  }
});

// Custom middleware to handle Bearer token
const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    // Check for clerkId in query parameters first
    const clerkId = req.query.clerkId;
    if (clerkId) {
      req.auth = {
        userId: clerkId,
        getToken: () => req.headers.authorization?.split(' ')[1]
      };
      return next();
    }

    // If no clerkId in query, proceed with normal token verification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(' ')[1];
    
    // Use the Clerk middleware to verify the token
    verifyToken(req, res, (err: any) => {
      if (err) {
        console.error("Clerk verification error:", err);
        return res.status(401).json({ msg: "Authentication failed" });
      }
      
      // The token is verified, now get the user ID
      const userId = req.auth?.userId;
      if (!userId) {
        return res.status(401).json({ msg: "User ID not found in token" });
      }

      // Set the user ID in the request
      req.auth = {
        userId: userId,
        getToken: () => token
      };

      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ msg: "Authentication failed" });
  }
};

export default authMiddleware;
