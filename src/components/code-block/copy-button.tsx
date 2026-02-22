'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  code: string;
  className?: string;
}

export function CopyButton({ code, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      className={cn(
        'flex items-center w-12 gap-1.5 text-xs text-[#6b7280] hover:text-[#abb2bf] transition-colors',
        className,
      )}
      aria-label="Copy code"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#98c379]" />
          <span className="text-[#98c379]">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
