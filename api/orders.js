const { ObjectId } = require("mongodb");
const { getDb } = require("../lib/mongodb");
const { stripDangerousKeys, cleanString, isValidEmail } = require("../lib/sanitize");

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    // Parse JSON body safely
    let body = "";
    await new Promise((resolve) => {
      req.on("data", (chunk) => (body += chunk));
      req.on("end", resolve);
    });

    let payload;
    try {
      payload = JSON.parse(body || "{}");
    } catch {
      res.status(400).json({ error: "Invalid JSON" });
      return;
    }

    payload = stripDangerousKeys(payload);

    const customer = payload.customer || {};
    const items = Array.isArray(payload.items) ? payload.items : [];

    const name = cleanString(customer.name, { max: 80 });
    const address = cleanString(customer.address, { max: 200 });
    const email = cleanString(customer.email, { max: 120 });

    if (!name || !address || !email || !isValidEmail(email)) {
      res.status(400).json({ error: "Invalid customer details" });
      return;
    }

    if (items.length === 0 || items.length > 50) {
      res.status(400).json({ error: "Invalid cart items" });
      return;
    }

    // Validate items: { productId, qty }
    const normalized = [];
    for (const it of items) {
      const productId = cleanString(it.productId, { max: 40 });
      const qty = Number(it.qty);

      if (!ObjectId.isValid(productId)) {
        res.status(400).json({ error: "Invalid productId in items" });
        return;
      }
      if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
        res.status(400).json({ error: "Invalid qty in items" });
        return;
      }
      normalized.push({ productId: new ObjectId(productId), qty });
    }

    const db = await getDb();

    // SECURITY: server-side pricing → never trust client total
    const ids = normalized.map((x) => x.productId);
    const products = await db
      .collection("products")
      .find({ _id: { $in: ids } }, { projection: { name: 1, price: 1, image: 1, category: 1 } })
      .toArray();

    if (products.length !== ids.length) {
      res.status(400).json({ error: "Some products no longer exist" });
      return;
    }

    const productMap = new Map(products.map((p) => [String(p._id), p]));

    const orderItems = normalized.map((x) => {
      const p = productMap.get(String(x.productId));
      return {
        productId: x.productId,
        name: p.name,
        price: p.price,
        qty: x.qty,
        lineTotal: Math.round(p.price * x.qty * 100) / 100
      };
    });

    const total = Math.round(orderItems.reduce((sum, x) => sum + x.lineTotal, 0) * 100) / 100;

    const order = {
      customer: { name, address, email },
      items: orderItems,
      total,
      status: "pending",
      createdAt: new Date()
    };

    const result = await db.collection("orders").insertOne(order);

    res.status(201).json({ orderId: result.insertedId, total });
  } catch (err) {
    res.status(500).json({ error: "Failed to create order", details: err.message });
  }
};