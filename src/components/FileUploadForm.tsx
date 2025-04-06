"use client";

import { type FormEvent } from "react";
import type { ConversionResult } from "@/types";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const AdvancedSettings = dynamic<{
  show: boolean;
  onToggle: () => void;
  useCustomCredentials: boolean;
  onCustomCredentialsChange: (value: boolean) => void;
}>(() => import("./AdvancedSettings").then(mod => mod.AdvancedSettings), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 w-40 rounded bg-zinc-800"></div>
      <div className="h-px w-full bg-zinc-800"></div>
    </div>
  )
});

const ResultDisplay = dynamic<{
  result: ConversionResult;
}>(() => import("./ResultDisplay").then(mod => mod.ResultDisplay), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-20 rounded bg-zinc-800"></div>
            <div className="h-4 w-32 rounded bg-zinc-800"></div>
          </div>
        ))}
      </div>
      <div className="h-40 w-full rounded bg-zinc-800"></div>
    </div>
  )
});

interface FileUploadFormProps {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  acceptedFileTypes: string;
  isLoading: boolean;
  error: string;
  result: ConversionResult | null;
  showAdvanced: boolean;
  setShowAdvanced: React.Dispatch<React.SetStateAction<boolean>>;
  useCustomCredentials: boolean;
  setUseCustomCredentials: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FileUploadForm({
  handleSubmit,
  acceptedFileTypes,
  isLoading,
  error,
  result,
  showAdvanced,
  setShowAdvanced,
  useCustomCredentials,
  setUseCustomCredentials
}: FileUploadFormProps) {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="file" className="text-base font-normal">
          Upload your file to convert to Markdown
          {!useCustomCredentials && (
            <span className="ml-2 text-sm text-zinc-500">(Image uploads require custom credentials)</span>
          )}
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept={acceptedFileTypes}
          className="w-full cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 file:mr-4 file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-normal file:text-zinc-100 hover:file:bg-zinc-700"
          required
        />
      </div>

      <Suspense fallback={<div className="h-4 w-40 rounded bg-zinc-800 animate-pulse"></div>}>
        <AdvancedSettings
          show={showAdvanced}
          onToggle={() => setShowAdvanced(!showAdvanced)}
          useCustomCredentials={useCustomCredentials}
          onCustomCredentialsChange={setUseCustomCredentials}
        />
      </Suspense>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-normal text-zinc-100 transition hover:bg-zinc-700 disabled:opacity-50"
      >
        {isLoading ? "Converting..." : "Convert to Markdown"}
      </button>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-red-200 text-sm">
          {error}
        </div>
      )}

      {result && (
        <Suspense fallback={<div className="h-40 w-full rounded bg-zinc-800 animate-pulse"></div>}>
          <ResultDisplay result={result} />
        </Suspense>
      )}
    </form>
  );
}
