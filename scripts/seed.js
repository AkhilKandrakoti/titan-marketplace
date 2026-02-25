require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const { getDb } = require("../lib/mongodb");

async function seed() {
  const db = await getDb();
  const filePath = path.join(process.cwd(), "data", "products.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const products = JSON.parse(raw);

  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("products.json must be a non-empty array.");
  }

  // Normalize categories to lowercase
  const cleaned = products.map((p) => ({
    name: String(p.name || "").trim(),
    price: Number(p.price || 0),
    category: String(p.category || "").trim().toLowerCase(),
    image: String(p.image || "").trim(),
    rating: Number(p.rating || 0),
    tags: Array.isArray(p.tags) ? p.tags.slice(0, 8).map(String) : []
  }));

  // Basic validation
  for (const p of cleaned) {
    if (!p.name || !p.category || !p.image || !(p.price > 0)) {
      throw new Error("Each product needs name, category, image, and price > 0.");
    }
  }

  const col = db.collection("products");

  // Replace existing (simple approach for capstone)
  await col.deleteMany({});
  const result = await col.insertMany(cleaned);

  console.log(`Seeded ${result.insertedCount} products.`);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});