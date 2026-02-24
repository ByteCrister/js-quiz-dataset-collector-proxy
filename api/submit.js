// api/submit.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body; // JSON from your GitHub Pages site

    // Call your Google Apps Script URL (exec) as you
    const appsScriptURL = "https://script.google.com/macros/s/AKfycbwjqrXiY-K9V9A8H5HI_aoDYbN4GVF41gtn7x09rRK1VPxsnqR9qZi6QHxPDeC9nuRQKw/exec";

    const response = await fetch(appsScriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    // Return response to the browser
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.toString() });
  }
}