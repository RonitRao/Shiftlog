import Groq from "groq-sdk";

// Detect if we are running on localhost
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

let groqInstance = null;

if (isLocal) {
  // Safe local mode using your local .env key
  groqInstance = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  });
}

export const groq = {
  chat: {
    completions: {
      create: async (params) => {
        if (isLocal && groqInstance) {
          return await groqInstance.chat.completions.create(params);
        }

        // Production Mode: Route through your secure serverless function
        const response = await fetch('/api/groq-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
      }
    }
  }
};