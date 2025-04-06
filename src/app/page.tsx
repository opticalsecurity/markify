"use client";

import { useState, type FormEvent } from "react";
import { Suspense } from "react";
import { FileUploadForm } from "@/components/FileUploadForm";
import { Footer } from "@/components/Footer";

interface ConversionResult {
  name: string;
  mimeType: string;
  format: string;
  tokens: number;
  markdown: string;
}

// Description component can be static and rendered on the server
function Description() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
        Markify
      </h1>
      <p className="max-w-md text-sm text-zinc-400">
        A simple demo app showcasing{" "}
        <a
          href="https://developers.cloudflare.com/workers-ai/markdown-conversion/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-300 hover:text-zinc-100 underline underline-offset-2"
        >
          Cloudflare Markdown Conversion
        </a>
        . Upload any supported file and get clean, LLM-ready markdown. You can use the default credentials or bring your own key.
      </p>
    </div>
  );
}

// Loading fallback for the form
function FormSkeleton() {
  return (
    <div className="w-full max-w-2xl animate-pulse space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="h-8 w-3/4 rounded bg-zinc-800"></div>
      <div className="h-12 w-full rounded bg-zinc-800"></div>
      <div className="h-10 w-1/3 rounded bg-zinc-800"></div>
    </div>
  );
}

export default function HomePage() {
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [useCustomCredentials, setUseCustomCredentials] = useState(false);

  const acceptedFileTypes = useCustomCredentials
    ? ".pdf,.jpeg,.jpg,.png,.webp,.svg,.html,.xml,.xlsx,.xlsm,.xlsb,.xls,.et,.ods,.csv,.numbers"
    : ".pdf,.html,.xml,.xlsx,.xlsm,.xlsb,.xls,.et,.ods,.csv,.numbers";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file") as File;

    if (!file) return;

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to convert file");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert file");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <Description />
        
        <Suspense fallback={<FormSkeleton />}>
          <div className="w-full max-w-2xl rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 shadow-lg">
            <FileUploadForm 
              handleSubmit={handleSubmit} 
              acceptedFileTypes={acceptedFileTypes} 
              isLoading={isLoading} 
              error={error} 
              result={result} 
              showAdvanced={showAdvanced} 
              setShowAdvanced={setShowAdvanced} 
              useCustomCredentials={useCustomCredentials} 
              setUseCustomCredentials={setUseCustomCredentials} 
            />
          </div>
        </Suspense>

        <Footer />
      </div>
    </main>
  );
}
