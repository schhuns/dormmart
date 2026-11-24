import "../config/env.js";
import mongoose from "mongoose";
import User from "../models/User.js";

/**
 * Ensures all existing users have unique display names.
 * Can be run standalone or invoked on server startup.
 */
export async function ensureUniqueUsernames() {
  try {
    const users = await User.find({}).sort({ createdAt: 1 });
    const seenNames = new Map();
    let updatedCount = 0;

    for (const user of users) {
      const lowerName = (user.fullName || "").toLowerCase().trim();
      if (!lowerName) continue;

      if (!seenNames.has(lowerName)) {
        seenNames.set(lowerName, 1);
      } else {
        let suffix = seenNames.get(lowerName);
        let candidate = `${user.fullName.trim()}_${suffix}`;
        
        while (seenNames.has(candidate.toLowerCase())) {
          suffix++;
          candidate = `${user.fullName.trim()}_${suffix}`;
        }
        
        seenNames.set(candidate.toLowerCase(), 1);
        seenNames.set(lowerName, suffix + 1);

        console.log(`⚡ Renamed duplicate: "${user.fullName}" -> "${candidate}" for ${user.email}`);
        user.fullName = candidate;
        await user.save();
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      console.log(`✅ Deduplicated ${updatedCount} user full names in database.`);
    }
  } catch (error) {
    console.error("Deduplication error:", error);
  }
}

// If executed directly from CLI:
if (process.argv[1] && process.argv[1].endsWith("deduplicateUsers.js")) {
  (async () => {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    await ensureUniqueUsernames();
    await mongoose.disconnect();
    console.log("Finished.");
  })();
}
