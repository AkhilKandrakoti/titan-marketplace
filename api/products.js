const { getDb } = require("../lib/mongodb");
const { cleanString } = require("../lib/sanitize");

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const db = await getDb();
    const { category, search } = req.query;

    const query = {};
    const safeCategory = cleanString(category || "", { max: 40 }).toLowerCase();
    const safeSearch = cleanString(search || "", { max: 60 });

    if (safeCategory) query.category = safeCategory;

    if (safeSearch) {
      // Escape regex special chars
      const escaped = safeSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.name = { $regex: escaped, $options: "i" };
    }

    // Optimized projection (don’t return unnecessary fields)
    const products = await db
      .collection("products")
      .find(query, { projection: { name: 1, price: 1, category: 1, image: 1, rating: 1, tags: 1 } })
      .sort({ _id: -1 })
      .limit(200)
      .toArray();

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=600");
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products", details: err.message });
  }
};