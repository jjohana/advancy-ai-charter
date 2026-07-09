import { createReadStream, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const host = "127.0.0.1";
const port = Number.parseInt(process.env.PORT || "8000", 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be an integer from 1 to 65535");
const root = resolve(process.cwd());
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".txt", "text/plain; charset=utf-8"]
]);
const rootFiles = new Set(["index.html", "app.js", "questions.js", "redirect.js", "styles.css", "privacy.html", "robots.txt"]);

function safePath(pathname) {
  const relative = pathname === "/" ? "index.html" : decodeURIComponent(pathname.slice(1));
  if (!rootFiles.has(relative) && !relative.startsWith("assets/")) return null;
  const absolute = resolve(root, relative);
  if (absolute !== root && !absolute.startsWith(root + sep)) return null;
  return absolute;
}

const server = createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  let file;
  try {
    file = safePath(new URL(request.url, `http://${host}:${port}`).pathname);
    if (!file || !statSync(file).isFile()) throw new Error("Not found");
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
    return;
  }
  const headers = {
    "Cache-Control": "no-store",
    "Content-Type": contentTypes.get(extname(file).toLowerCase()) || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY"
  };
  if (file.endsWith(`${sep}index.html`)) {
    const html = readFileSync(file, "utf8").replace(
      "connect-src https://advancy-ai-score-api.advancy-ai-training.workers.dev",
      "connect-src http://127.0.0.1:8787"
    );
    response.writeHead(200, { ...headers, "Content-Length": Buffer.byteLength(html) });
    response.end(request.method === "HEAD" ? undefined : html);
    return;
  }
  response.writeHead(200, { ...headers, "Content-Length": statSync(file).size });
  if (request.method === "HEAD") response.end();
  else createReadStream(file).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Local assessment server: http://${host}:${port}`);
});
