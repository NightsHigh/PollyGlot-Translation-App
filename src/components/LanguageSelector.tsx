import { cn } from "@/lib/utils";
import { supportedLanguages } from "@/lib/openai";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
  className?: string;
}

export const LanguageSelector = ({
  selectedLanguage,
  onLanguageSelect,
  className,
}: LanguageSelectorProps) => {
  const mainLanguages = ["fr", "es", "ja"] as const;

  return (
    <div className={cn("flex gap-4 justify-center items-center", className)}>
      {mainLanguages.map((langCode) => {
        const language = supportedLanguages[langCode];
        const isSelected = selectedLanguage === langCode;

        return (
          <button
            key={langCode}
            onClick={() => onLanguageSelect(langCode)}
            className={cn(
              "w-[50px] h-[33px] rounded border transition-all duration-200 hover:scale-105",
              {
                "border-[3px] border-[#035A9D] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]":
                  isSelected,
                "border border-[#999] hover:border-[#035A9D]": !isSelected,
              },
            )}
            aria-label={`Select ${language.name}`}
          >
            <img
              src={language.flag}
              alt={`${language.name} flag`}
              className="w-full h-full object-cover rounded"
            />
          </button>
        );
      })}
    </div>
  );
};
