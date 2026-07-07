// api/groq-chat.js
import Groq from 'groq-sdk';

// Initialize with backend secure environment key
const groqInstance = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

export default async function handler(req, res) {
  // Enforce rigid request constraints
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages, model } = req.body;

    // Direct proxy interface execution targeting Groq standard API endpoints
    const chatCompletion = await groqInstance.chat.completions.create({
      messages,
      model: model || "meta-llama/llama-4-scout-17b-16e-instruct",
    });

    // Return exact structural format expected by standard client SDK choices array
    return res.status(200).json(chatCompletion);
  } catch (error) {
    console.error("Serverless Proxy Exception:", error);
    return res.status(500).json({ error: error.message || "Internal Routing Fault" });
  }
}