import "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import { ensureBlueprintCategories } from "./seed/seedCategories.js";
import { ensureUniqueUsernames } from "./scripts/deduplicateUsers.js";

const PORT = process.env.PORT || 5001;

// Connect to MongoDB Atlas and verify blueprint categories & unique names
connectDB().then(async () => {
  await ensureBlueprintCategories();
  await ensureUniqueUsernames();
  app.listen(PORT, () => {
    console.log(`🚀 Dorm Mart Server running on http://localhost:${PORT}`);
    if (process.env.GOOGLE_CLIENT_ID) {
      console.log(`🔑 Google OAuth configured: ${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...`);
    } else {
      console.log(`ℹ️ Google OAuth not configured (Email login and Demo accounts are active)`);
    }
  });
});
