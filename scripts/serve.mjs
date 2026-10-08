import { execFileSync, spawn } from "node:child_process";
import { isIPv4 } from "node:net";
import { fileURLToPath } from "node:url";

const mode = process.argv[2];
if (mode !== "dev" && mode !== "preview") {
  console.error("Usage: node scripts/serve.mjs dev|preview");
  process.exit(1);
}

let host;
try {
  host = execFileSync("tailscale", ["ip", "-4"], {
    encoding: "utf8",
    timeout: 5000,
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
} catch {
  console.error(
    "Could not find a Tailscale IPv4 address. Connect this machine to Tailscale, or use npm run dev:local / preview:local.",
  );
  process.exit(1);
}
if (!isIPv4(host)) {
  console.error(
    "Tailscale did not return a valid IPv4 address. Check tailscale status.",
  );
  process.exit(1);
}

const port = mode === "dev" ? "5173" : "4173";
console.log(`Air2Growth ${mode}: http://${host}:${port} (Tailscale)`);
const vite = fileURLToPath(
  new URL("../node_modules/vite/bin/vite.js", import.meta.url),
);
const child = spawn(
  process.execPath,
  [
    vite,
    ...(mode === "preview" ? ["preview"] : []),
    "--host",
    host,
    "--port",
    port,
    "--strictPort",
    ...process.argv.slice(3),
  ],
  {
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    stdio: "inherit",
  },
);
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
child.on("error", (error) => {
  console.error(`Could not start Vite: ${error.message}`);
  process.exit(1);
});
child.on("exit", (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
