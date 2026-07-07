import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Required since we are firing requests directly from the client side
});