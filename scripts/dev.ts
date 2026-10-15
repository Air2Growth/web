// Coordinated dev: initial CSS build, then Bun --hot server + Tailwind --watch.
// Run: bun run dev
// - Initial build first so a clean checkout serves public/styles.css on first request.
// - Race child exits: if server fails (e.g. port conflict) the CSS watcher is
//   killed instead of lingering forever; exit code propagates the failure.
const build = Bun.spawn(
  ["bunx", "@tailwindcss/cli", "-i", "./src/styles.css", "-o", "./public/styles.css"],
  { stdout: "inherit", stderr: "inherit" },
);
const buildCode = await build.exited;
if (buildCode !== 0) {
  console.error(`dev: initial CSS build failed (exit=${buildCode})`);
  process.exit(typeof buildCode === "number" ? buildCode : 1);
}

const server = Bun.spawn(["bun", "--hot", "server.ts"], {
  stdout: "inherit",
  stderr: "inherit",
  stdin: "inherit",
});

const css = Bun.spawn(
  ["bunx", "@tailwindcss/cli", "-i", "./src/styles.css", "-o", "./public/styles.css", "--watch"],
  { stdout: "inherit", stderr: "inherit" },
);

let stopping = false;
function shutdown(signal: string, code = 0) {
  if (stopping) return;
  stopping = true;
  console.log(`\ndev: ${signal}, stopping children…`);
  try {
    server.kill();
  } catch {}
  try {
    css.kill();
  } catch {}
  setTimeout(() => process.exit(code), 300);
}

process.on("SIGINT", () => shutdown("SIGINT", 0));
process.on("SIGTERM", () => shutdown("SIGTERM", 0));

// Race: whichever child exits first decides. Kill the survivor so a server
// port-conflict cannot leave `tailwind --watch` alive forever.
const first: { name: string; code: number | null } = await Promise.race([
  server.exited.then((code) => ({ name: "server", code })),
  css.exited.then((code) => ({ name: "css", code })),
]);
if (!stopping) {
  stopping = true;
  const other = first.name === "server" ? css : server;
  try {
    other.kill();
  } catch {}
  // Let the survivor terminate, but do not wait forever.
  await Promise.race([
    Promise.all([server.exited, css.exited]),
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]);
  const code = typeof first.code === "number" ? first.code : 1;
  console.log(`dev: ${first.name} exited (exit=${String(first.code)}), stopped sibling`);
  process.exit(code);
}
