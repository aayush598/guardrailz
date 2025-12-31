import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/utils/crypto";

export async function warmApiKeysCache() {
  try {
    const allActiveKeys = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.isActive, true));

    console.log(`Warming cache with ${allActiveKeys.length} API keys...`);

    for (const key of allActiveKeys) {
      const plainKey = decrypt(key.keyEncrypted);
      
      await redis.hset(`apikey:${plainKey}`, {
        id: key.id,
        userId: key.userId,
        active: "true",
        rpm: key.requestsPerMinute.toString(),
        rpd: key.requestsPerDay.toString(),
      });
      
      await redis.expire(`apikey:${plainKey}`, 86400);
    }

    console.log("API keys cache warmed successfully");
  } catch (error) {
    console.error("Failed to warm API keys cache:", error);
  }
}