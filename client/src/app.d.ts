/// <reference types="@sveltejs/kit" />

declare global {
    namespace App {
        interface Error {
            message: string;
            code?: string;
        }
        interface Locals {
            userId: string | null;
            sessionId: string | null;
        }
        interface PageData {
            userId?: string | null;
        }
        interface PageState {}
        interface Platform {}
    }
}

// Environment variables
declare namespace NodeJS {
    interface ProcessEnv {
        VITE_API_URL: string;
        VITE_CLERK_PUBLISHABLE_KEY: string;
    }
}

export {};
