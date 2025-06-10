import { cn } from "@/lib/utils"
import { Megaphone } from "lucide-react"

interface AdPlaceholderProps {
  className?: string
}

export default function AdPlaceholder({ className }: AdPlaceholderProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-primary/5 to-secondary/5 border border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]",
        className,
      )}
      style={{ animationDelay: "0.2s" }}
    >
      <div className="text-center">
        <div className="flex justify-center mb-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Megaphone className="h-5 w-5 text-primary" />
          </div>
        </div>
        <p className="text-gray-700 font-medium">Advertisement</p>
        <p className="text-gray-500 text-sm">Promote your fitness products here</p>
      </div>
    </div>
  )
}
