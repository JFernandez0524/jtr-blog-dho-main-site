import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";

const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour in seconds

// Derive the table name from the environment (Amplify sets this automatically)
// Falls back to in-memory for local dev without a sandbox
const TABLE_NAME = process.env.RATE_LIMIT_TABLE_NAME;

// In-memory fallback for local development
const localMap = new Map<string, { count: number; resetTime: number }>();

export async function checkRateLimit(key: string): Promise<boolean> {
  if (!TABLE_NAME) {
    return localFallback(key);
  }

  const client = new DynamoDBClient({});
  const now = Math.floor(Date.now() / 1000);

  try {
    const existing = await client.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
        Key: { key: { S: key } },
      })
    );

    const item = existing.Item;
    const count = item ? parseInt(item.count.N ?? "0") : 0;
    const expiresAt = item ? parseInt(item.expiresAt.N ?? "0") : 0;

    if (!item || expiresAt < now) {
      // New window
      await client.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          Item: {
            key: { S: key },
            count: { N: "1" },
            expiresAt: { N: String(now + RATE_LIMIT_WINDOW) },
          },
        })
      );
      return true;
    }

    if (count >= RATE_LIMIT) return false;

    await client.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
          key: { S: key },
          count: { N: String(count + 1) },
          expiresAt: { N: String(expiresAt) },
        },
      })
    );
    return true;
  } catch (error) {
    console.error("Rate limit check failed, allowing request:", error);
    return true; // fail open to avoid blocking legitimate users on DB errors
  }
}

function localFallback(key: string): boolean {
  const now = Date.now();
  for (const [k, v] of localMap.entries()) {
    if (v.resetTime < now) localMap.delete(k);
  }
  const record = localMap.get(key);
  if (!record || record.resetTime < now) {
    localMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW * 1000 });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}
