import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export async function callDeepSeek(messages) {
  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat",
        messages: messages,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "DeepSeek API error:",
      error.response?.data || error.message
    );
    throw error;
  }
}
