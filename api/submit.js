// api/submit.js

export default async function handler(req, res) {
  // Dynamic import for ESM module
  const fetch = (await import("node-fetch")).default;
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // preflight
  }

  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const payload = req.body;

    const appsScriptURL =
      "https://script.google.com/macros/s/AKfycbwjqrXiY-K9V9A8H5HI_aoDYbN4GVF41gtn7x09rRK1VPxsnqR9qZi6QHxPDeC9nuRQKw/exec";

    const response = await fetch(appsScriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { status: "error", message: "Invalid JSON from Apps Script", raw: text };
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: err.toString() });
  }
}