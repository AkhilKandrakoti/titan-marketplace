function stripDangerousKeys(value) {
  // Removes keys that begin with $ or contain . (Mongo operator / path injection vectors)
  if (Array.isArray(value)) return value.map(stripDangerousKeys);

  if (value && typeof value === "object") {
    const cleanObj = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("$")) continue;
      if (k.includes(".")) continue;
      cleanObj[k] = stripDangerousKeys(v);
    }
    return cleanObj;
  }

  return value;
}

function cleanString(input, { max = 200 } = {}) {
  if (typeof input !== "string") return "";
  const s = input.trim().replace(/\s+/g, " ");
  return s.slice(0, max);
}

function isValidEmail(email) {
  // Practical email validation (not perfect, good enough for web apps)
  if (typeof email !== "string") return false;
  const e = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
}

module.exports = { stripDangerousKeys, cleanString, isValidEmail };