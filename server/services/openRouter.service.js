import axios from "axios";

// ✅ Using Groq — free API, extremely fast (Llama 3 at ~500 tokens/sec)
// Get your free API key at: https://console.groq.com
// Add to your .env: GROQ_API_KEY=your_key_here

export const askAi = async (messages) => {
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is empty.");
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", // ✅ fastest free model on Groq
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000, // 15s — Groq is fast, so this is plenty
      },
    );

    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content || !content.trim()) {
      throw new Error("AI returned empty response.");
    }

    return content;
  } catch (error) {
    console.error("Groq Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || "Groq API Error");
  }
};
