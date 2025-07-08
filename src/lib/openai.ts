import OpenAI from "openai";
import { translateWithHuggingFace } from "./huggingface";

// Lazy initialization of OpenAI client
let openai: OpenAI | null = null;

const getOpenAIClient = (): OpenAI => {
  if (!openai) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
      throw new Error(
        "OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your environment variables.",
      );
    }

    openai = new OpenAI({
      apiKey: apiKey.trim(),
      dangerouslyAllowBrowser: true,
    });
  }

  return openai;
};

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export const translateText = async ({
  text,
  targetLanguage,
  sourceLanguage = "auto",
}: TranslationRequest): Promise<TranslationResponse> => {
  // Try Hugging Face first (FREE!)
  const huggingFaceKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  if (huggingFaceKey) {
    try {
      const result = await translateWithHuggingFace({ text, targetLanguage });
      return result;
    } catch (error) {
      console.log("Hugging Face failed, trying OpenAI:", error);
    }
  }

  // Fallback to OpenAI (Paid)
  try {
    const client = getOpenAIClient();

    const prompt =
      sourceLanguage === "auto"
        ? `Translate the following text to ${targetLanguage}. Only return the translation, no explanation: "${text}"`
        : `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only return the translation, no explanation: "${text}"`;

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator. Provide accurate translations without any additional commentary or explanation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.1,
    });

    const translatedText =
      completion.choices[0]?.message?.content?.trim() || text;

    return {
      translatedText,
      sourceLanguage:
        sourceLanguage === "auto" ? "auto-detected" : sourceLanguage,
      targetLanguage,
    };
  } catch (error) {
    console.log("All APIs failed, using demo mode:", error);
    return getDemoTranslation(text, targetLanguage);
  }
};

// Demo translations for when API key is not configured
const getDemoTranslation = (
  text: string,
  targetLanguage: string,
): TranslationResponse => {
  const demoTranslations: Record<string, Record<string, string>> = {
    "How are you?": {
      French: "Comment allez-vous?",
      Spanish: "¿Cómo estás?",
      Japanese: "元気ですか？",
    },
    Hello: {
      French: "Bonjour",
      Spanish: "Hola",
      Japanese: "こんにちは",
    },
    hello: {
      French: "Bonjour",
      Spanish: "Hola",
      Japanese: "こんにちは",
    },
    "Thank you": {
      French: "Merci",
      Spanish: "Gracias",
      Japanese: "ありがとうございます",
    },
    "thank you": {
      French: "Merci",
      Spanish: "Gracias",
      Japanese: "ありがとうございます",
    },
    "Good morning": {
      French: "Bonjour",
      Spanish: "Buenos días",
      Japanese: "おはようございます",
    },
    "good morning": {
      French: "Bonjour",
      Spanish: "Buenos días",
      Japanese: "おはようございます",
    },
    Goodbye: {
      French: "Au revoir",
      Spanish: "Adiós",
      Japanese: "さようなら",
    },
    goodbye: {
      French: "Au revoir",
      Spanish: "Adiós",
      Japanese: "さようなら",
    },
    Please: {
      French: "S'il vous plaît",
      Spanish: "Por favor",
      Japanese: "お願いします",
    },
    please: {
      French: "S'il vous plaît",
      Spanish: "Por favor",
      Japanese: "お願いします",
    },
  };

  const translation =
    demoTranslations[text]?.[targetLanguage] ||
    `🎮 Demo: "${text}" → ${targetLanguage} (Add OpenAI key for real translation)`;

  return {
    translatedText: translation,
    sourceLanguage: "auto-detected",
    targetLanguage,
  };
};

export const supportedLanguages = {
  fr: {
    name: "French",
    flag: "https://cdn.builder.io/api/v1/image/assets/TEMP/c6b3cb52203375d611e7d6434f199ef0adc2c57d",
  },
  es: {
    name: "Spanish",
    flag: "https://cdn.builder.io/api/v1/image/assets/TEMP/8370ecf552c11379212a86e6cf94d81f0cd58d91",
  },
  ja: {
    name: "Japanese",
    flag: "https://cdn.builder.io/api/v1/image/assets/TEMP/9b304b8e736eb37cf94cee7e03e8d10897cd8ee9",
  },
  en: { name: "English", flag: "/placeholder.svg" },
  de: { name: "German", flag: "/placeholder.svg" },
  it: { name: "Italian", flag: "/placeholder.svg" },
  pt: { name: "Portuguese", flag: "/placeholder.svg" },
  ru: { name: "Russian", flag: "/placeholder.svg" },
  zh: { name: "Chinese", flag: "/placeholder.svg" },
  ko: { name: "Korean", flag: "/placeholder.svg" },
};
