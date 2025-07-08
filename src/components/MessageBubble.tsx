import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  isTranslation?: boolean;
  className?: string;
}

export const MessageBubble = ({
  message,
  isUser,
  isTranslation = false,
  className,
}: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "max-w-[313px] p-4 rounded-xl text-center font-poppins font-bold text-xl leading-[150%]",
        {
          // User messages (green)
          "bg-[#65DA65] text-[#333] rounded-tl-[2px] rounded-tr-[10px] rounded-bl-[10px] rounded-br-[10px] ml-auto":
            isUser,
          // System/Bot messages (blue)
          "bg-[#035A9D] text-white rounded-tl-[10px] rounded-tr-[2px] rounded-bl-[10px] rounded-br-[10px]":
            !isUser,
        },
        className,
      )}
    >
      {message}
    </div>
  );
};
