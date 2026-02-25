require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");

let cached = global._mongoClient;
if (!cached) cached = global._mongoClient = { client: null, promise: null };

async function getMongoClient() {
  if (cached.client) return cached.client;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Missing MONGODB_URI in environment variables.");

    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000
    });

    cached.promise = client.connect().then(() => client);
  }

  cached.client = await cached.promise;
  return cached.client;
}

async function getDb() {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB || "titan_marketplace";
  return client.db(dbName);
}

module.exports = { getDb };