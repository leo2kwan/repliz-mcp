#!/usr/bin/env node
/**
 * Repliz MCP server entry point.
 *
 * Exposes the Repliz Public API as Model Context Protocol tools, in one of two
 * transport modes:
 *
 *   - stdio (default): a local subprocess for desktop/dev clients
 *       (Claude Desktop, Claude Code, Cursor, Gemini CLI, ...).
 *       Credentials come from REPLIZ_ACCESS_KEY / REPLIZ_SECRET_KEY env vars.
 *
 *   - http: a remote, multi-user Streamable HTTP server for web/hosted clients
 *       (Claude.ai connectors, ChatGPT developer mode, API integrations).
 *       Each user supplies their own credentials via request headers.
 *       Enable with `--http` or REPLIZ_TRANSPORT=http. Port via PORT (default 3000).
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runStdio } from "./transports/stdio.js";
import { runHttp } from "./transports/http.js";

// Convenience: auto-load a local .env if present, so credentials don't have to
// be passed inline. Uses Node's built-in env-file loader (Node >= 20.12), so no
// dependency. Variables already set in the real environment always win, and
// loadEnvFile does not overwrite already-loaded values — so cwd takes priority.
function tryLoadEnv(path?: string): void {
  try {
    path ? process.loadEnvFile(path) : process.loadEnvFile();
  } catch {
    // No file there (or unsupported Node) — ignore and try the next source.
  }
}

tryLoadEnv(); // 1) .env in the current working directory
try {
  // 2) .env next to the package, so it works no matter where the client
  //    launches the server from (dist/index.js -> ../.env).
  const packageDir = join(dirname(fileURLToPath(import.meta.url)), "..");
  tryLoadEnv(join(packageDir, ".env"));
} catch {
  /* ignore */
}

const useHttp =
  process.argv.includes("--http") || process.env.REPLIZ_TRANSPORT?.toLowerCase() === "http";

(useHttp ? runHttp() : runStdio()).catch((err) => {
  console.error("Fatal error starting Repliz MCP server:");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
