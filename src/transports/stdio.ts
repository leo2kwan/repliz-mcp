/** Local stdio transport: one process, credentials from env vars. */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "../config.js";
import { ReplizClient } from "../client.js";
import { createReplizServer } from "../server.js";

export async function runStdio(): Promise<void> {
  const config = loadConfig();
  const client = new ReplizClient(config);
  const server = createReplizServer(client);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // stdout is reserved for the MCP protocol stream — log to stderr.
  console.error(`Repliz MCP server running (stdio, base URL: ${config.baseUrl}).`);
}
