const axios = require("axios");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const HTTP_REFERER = process.env.HTTP_REFERER || "http://localhost:3000";
const X_TITLE = process.env.X_TITLE || "Hotel Microservices App";

async function queryLLMWithImage(textPrompt, imageUrl) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        "model": "deepseek/deepseek-prover-v2:free",
        max_tokens: 1000, // Limite raisonnable de réponse
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: textPrompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": HTTP_REFERER,
          "X-Title": X_TITLE,
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log("OpenRouter API response:", response.data);

    // Vérifie la structure avant d'accéder à choices[0]
    if (
      response.data &&
      Array.isArray(response.data.choices) &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content
    ) {
      return response.data.choices[0].message.content;
    } else {
      console.error("Réponse inattendue de l'API OpenRouter:", response.data);
      return "Erreur : réponse inattendue du LLM.";
    }
  } catch (error) {
    console.error("OpenRouter LLM Error:", error.response?.data || error.message);
    return "Erreur lors de la communication avec le LLM.";
  }
}

module.exports = { queryLLMWithImage };
