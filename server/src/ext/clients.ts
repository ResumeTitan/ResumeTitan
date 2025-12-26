import { createClerkClient } from '@clerk/backend';
// import Stripe from 'stripe';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

// Setup Clerk Client
export const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// Setup Stripe Client
// export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

// Setup Gemini Client
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
export const geminiClient = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
