import { createClerkClient } from '@clerk/backend';
// import Stripe from 'stripe';
import { ChatOpenAI } from "@langchain/openai";
import 'dotenv/config';

// Setup Clerk Client
export const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// Setup Stripe Client
// export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

// Setup ChatGPT Client
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const openAiClient = new ChatOpenAI({ model: "gpt-4o", apiKey: OPENAI_API_KEY });
