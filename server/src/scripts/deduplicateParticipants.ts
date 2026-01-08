/**
 * Script to deduplicate workshop participants
 *
 * Run with: npx ts-node src/scripts/deduplicateParticipants.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Workshop from '../models/Workshop';

dotenv.config();

async function deduplicateParticipants() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log('Connected to MongoDB');

        // Get all workshops
        const workshops = await Workshop.find({});
        console.log(`Found ${workshops.length} workshops`);

        let updatedCount = 0;

        for (const workshop of workshops) {
            const originalCount = workshop.participants.length;

            // Deduplicate by clerkId, keeping the most recent entry
            const uniqueMap = new Map();
            workshop.participants.forEach((participant: any) => {
                const existing = uniqueMap.get(participant.clerkId);
                // Keep the one with the latest joinedAt or the current one if no joinedAt
                if (!existing || (participant.joinedAt && participant.joinedAt > existing.joinedAt)) {
                    uniqueMap.set(participant.clerkId, participant);
                }
            });

            const uniqueParticipants = Array.from(uniqueMap.values());

            // Clear and repopulate
            workshop.participants.splice(0, workshop.participants.length, ...uniqueParticipants);

            if (originalCount !== workshop.participants.length) {
                await workshop.save();
                console.log(`Workshop ${workshop._id}: Reduced from ${originalCount} to ${workshop.participants.length} participants`);
                updatedCount++;
            }
        }

        console.log(`\nDeduplication complete. Updated ${updatedCount} workshops.`);

        process.exit(0);
    } catch (error) {
        console.error('Error during deduplication:', error);
        process.exit(1);
    }
}

deduplicateParticipants();
