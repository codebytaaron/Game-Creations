import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock = ({ code, language = "cpp", className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group", className)}>
      <div className="absolute right-4 top-4 z-10 sticky-copy-button">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/80 hover:bg-accent text-accent-foreground text-sm font-medium transition-all duration-200 backdrop-blur-sm border border-border/50 shadow-lg"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="code-block-container overflow-x-auto rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
        <pre className="p-6 pt-16 text-sm leading-relaxed overflow-x-auto">
          <code className={`language-${language} text-code font-mono`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};
