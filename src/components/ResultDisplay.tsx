"use client";

import type { ConversionResult } from "@/types";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface ResultDisplayProps {
  result: ConversionResult;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const [parent] = useAutoAnimate()
  return (
    <div className="mt-2 flex flex-col gap-4" ref={parent}>
      <div className="grid grid-cols-2 gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div>
          <h4 className="text-sm font-normal text-zinc-400">File Name</h4>
          <p className="text-sm text-zinc-300">{result.name}</p>
        </div>
        <div>
          <h4 className="text-sm font-normal text-zinc-400">File Type</h4>
          <p className="text-sm text-zinc-300">{result.mimeType}</p>
        </div>
        <div>
          <h4 className="text-sm font-normal text-zinc-400">Output Format</h4>
          <p className="text-sm text-zinc-300">{result.format}</p>
        </div>
        <div>
          <h4 className="text-sm font-normal text-zinc-400">Token Count</h4>
          <p className="text-sm text-zinc-300">{result.tokens.toLocaleString()}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-normal text-zinc-100">Converted Markdown</h3>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(result.markdown);
            }}
            className="rounded bg-zinc-800 px-3 py-1 text-sm font-normal text-zinc-100 hover:bg-zinc-700"
          >
            Copy
          </button>
        </div>
        <pre className="mt-2 max-h-96 overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
          {result.markdown}
        </pre>
      </div>
    </div>
  );
}
