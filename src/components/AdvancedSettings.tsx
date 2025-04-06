"use client";

export interface AdvancedSettingsProps {
  show: boolean;
  onToggle: () => void;
  useCustomCredentials: boolean;
  onCustomCredentialsChange: (value: boolean) => void;
}

export function AdvancedSettings({
  show,
  onToggle,
  useCustomCredentials,
  onCustomCredentialsChange,
}: AdvancedSettingsProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          className="text-sm text-zinc-400 hover:text-zinc-300"
        >
          {show ? "Hide" : "Show"} Advanced Settings
        </button>
        <div className="flex-1 border-t border-zinc-800"></div>
      </div>

      {show && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center gap-2">
            <input
              type="checkbox"
              id="useCustom"
              checked={useCustomCredentials}
              onChange={(e) => onCustomCredentialsChange(e.target.checked)}
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
    </>
  );
}
