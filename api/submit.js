// api/submit.js
export default async function handler(req, res) {
  const fetch = (await import("node-fetch")).default;

  // CORS headers for client
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
      "https://script.google.com/macros/s/AKfycbwg4rbgnYqJrfRQ4bCO6bqmnObEO6dOBx9qKEAqfQY0QbpilbLZJ9zFJpfhM9CjkDIbNA/exec";

    const response = await fetch(appsScriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Get text first
    let text = await response.text();

    // Strip BOM / whitespace
    text = text.replace(/^\uFEFF/, "").trim();

    let result;
    try {
      result = JSON.parse(text);
    } catch (err) {
      console.warn("Invalid JSON from Apps Script:", text);
      result = { status: "error", message: "Invalid JSON from Apps Script", raw: text };
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Proxy submission error:", err);
    return res.status(500).json({ status: "error", message: err.toString() });
  }
}