interface HuggingFaceTranslationRequest {
  text: string;
  targetLanguage: string;
}

interface HuggingFaceTranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

// Language mappings for Hugging Face models
const languageModels: Record<string, string> = {
  French: "Helsinki-NLP/opus-mt-en-fr",
  Spanish: "Helsinki-NLP/opus-mt-en-es",
  Japanese: "Helsinki-NLP/opus-mt-en-jap",
  German: "Helsinki-NLP/opus-mt-en-de",
  Italian: "Helsinki-NLP/opus-mt-en-it",
  Portuguese: "Helsinki-NLP/opus-mt-en-pt",
};

export const translateWithHuggingFace = async ({
  text,
  targetLanguage,
}: HuggingFaceTranslationRequest): Promise<HuggingFaceTranslationResponse> => {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error("Hugging Face API key not found");
  }

  const model = languageModels[targetLanguage];
  if (!model) {
    throw new Error(`Translation to ${targetLanguage} not supported`);
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: text,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const result = await response.json();

    // Handle different response formats
    let translatedText = "";
    if (Array.isArray(result) && result[0]?.translation_text) {
      translatedText = result[0].translation_text;
    } else if (result.translation_text) {
      translatedText = result.translation_text;
    } else {
      throw new Error("Unexpected response format");
    }

    return {
      translatedText,
      sourceLanguage: "English",
      targetLanguage,
    };
  } catch (error) {
    console.error("Hugging Face translation error:", error);
    throw error;
  }
};
