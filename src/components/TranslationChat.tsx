import { useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { LanguageSelector } from "./LanguageSelector";
import { translateText, supportedLanguages } from "@/lib/openai";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  language?: string;
}

export const TranslationChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Select the language you want me to translate into, type your text and hit send!",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTranslating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTranslating(true);

    try {
      const result = await translateText({
        text: inputText,
        targetLanguage:
          supportedLanguages[
            selectedLanguage as keyof typeof supportedLanguages
          ].name,
      });

      const translationMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.translatedText,
        isUser: false,
        language: selectedLanguage,
      };

      setMessages((prev) => [...prev, translationMessage]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to translate text";

      // Show helpful message for missing API key or quota issues
      if (errorMessage.includes("API key is not configured")) {
        toast({
          title: "Demo Mode",
          description:
            "Add VITE_OPENAI_API_KEY to your .env file for real AI translations. Using demo responses for now.",
          variant: "default",
        });
      } else if (errorMessage.includes("quota exceeded")) {
        // Don't show error for quota - let it fall back to demo mode silently
        console.log("Quota exceeded, using demo mode");
      } else {
        toast({
          title: "Translation Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-[390px] mx-auto bg-white">
      {/* Header */}
      <div className="relative h-[213px] bg-[#0D182E] overflow-hidden">
        {/* Background World Map */}
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/1711d0b1eb0c08d49aea056eadf142d425fe3470"
          alt="World Map"
          className="absolute -left-[89px] -top-[18px] w-[559px] h-[217px] object-cover"
        />

        {/* Logo and Title */}
        <div className="absolute left-[42px] top-[65px] flex items-center gap-4">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a01d53c79592b3d5837108854fcaa9c0101c5bd4"
            alt="PollyGlot Parrot"
            className="w-[95px] h-[85px] flex-shrink-0"
          />
          <div className="flex flex-col">
            <h1 className="text-[#32CD32] font-['Big_Shoulders_Display'] text-[43.419px] font-[800] leading-[150%] whitespace-nowrap">
              PollyGlot
            </h1>
            <p className="text-white font-poppins text-[12.212px] font-[600] leading-[150%] mt-1">
              Perfect Translation Every Time
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="relative mx-[13px] mt-[30px]">
        <div className="border-4 border-[#252F42] rounded-[15px] bg-white min-h-[505px] p-6">
          {/* Messages */}
          <div className="space-y-4 mb-6">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                className="mx-auto"
              />
            ))}
            {isTranslating && (
              <div className="flex justify-center">
                <div className="bg-[#035A9D] text-white p-4 rounded-xl flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="font-poppins font-bold">Translating...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="mt-auto">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="w-full h-[67px] p-4 border-[1.5px] border-[#586E88] rounded-[10px] bg-[#F5F5F5] resize-none font-poppins text-[#333] placeholder:text-[#999] focus:outline-none focus:border-[#035A9D] focus:bg-white transition-all duration-200"
                disabled={isTranslating}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTranslating}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200",
                  {
                    "text-[#32CD32] hover:bg-[#32CD32] hover:text-white":
                      inputText.trim() && !isTranslating,
                    "text-gray-400 cursor-not-allowed":
                      !inputText.trim() || isTranslating,
                  },
                )}
              >
                <Send
                  className="w-[23px] h-[23px] rotate-90"
                  strokeWidth={2.532}
                />
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="mt-6">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageSelect={setSelectedLanguage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
