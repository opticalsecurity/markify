export function Footer() {
  return (
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
        This app doesn't store any data, and it doesn't have a database. See the{" "}
        <a
          href="https://github.com/opticalsecurity/markify"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-zinc-300 underline underline-offset-2"
        >
          GitHub repository
        </a>
        {" "}for more details.
      </p>
    </footer>
  );
}
