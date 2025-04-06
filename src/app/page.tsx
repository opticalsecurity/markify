"use client";

import { useState, type FormEvent } from "react";

interface ConversionResult {
  name: string;
  mimeType: string;
  format: string;
  tokens: number;
  markdown: string;
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
        
        <div className="w-full max-w-2xl rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 shadow-lg">
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-zinc-400 hover:text-zinc-300"
              >
                {showAdvanced ? "Hide" : "Show"} Advanced Settings
              </button>
              <div className="flex-1 border-t border-zinc-800"></div>
            </div>

            {showAdvanced && (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useCustom"
                    checked={useCustomCredentials}
                    onChange={(e) => setUseCustomCredentials(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-zinc-500"
                  />
                  <label htmlFor="useCustom" className="text-sm text-zinc-300">
                    Use custom Cloudflare credentials
                  </label>
                </div>

                {useCustomCredentials && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label htmlFor="apiToken" className="mb-1 block text-sm font-normal text-zinc-400">
                        API Token
                      </label>
                      <input
                        type="password"
                        id="apiToken"
                        name="apiToken"
                        placeholder="Your Cloudflare API token"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="accountId" className="mb-1 block text-sm font-normal text-zinc-400">
                        Account ID
                      </label>
                      <input
                        type="text"
                        id="accountId"
                        name="accountId"
                        placeholder="Your Cloudflare Account ID"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

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
              <div className="mt-2 flex flex-col gap-4">
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
            )}
          </form>
        </div>

        <footer className="text-center text-sm text-zinc-500">
          <p>
            Built by{" "}
            <a
              href="https://nicast.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-300 underline underline-offset-2"
            >
              Manuel Nicastro
            </a>
            {" "}as a demo for Cloudflare Workers AI
          </p>
          <p>
            This app doesn't store any data, and it doesn't have a database. See the <a href="https://github.com/opticalsecurity/markify" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-300 underline underline-offset-2">GitHub repository</a> for more details.
          </p>
        </footer>
      </div>
    </main>
  );
}
