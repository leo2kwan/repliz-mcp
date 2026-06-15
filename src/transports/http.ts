/**
 * Remote Streamable HTTP transport for multi-user hosting.
 *
 * Each MCP session is authenticated at initialize time from request headers
 * (or, as a fallback, from env credentials for single-tenant hosting). The
 * resolved Repliz client is bound to that session's server instance, so users
 * are isolated from one another.
 */

import express, { type Request, type Response } from "express";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { ReplizClient } from "../client.js";
import { createReplizServer } from "../server.js";
import { credentialsFromHeaders, envCredentials, getBaseUrl } from "../config.js";

const MCP_PATH = "/mcp";

function jsonRpcError(code: number, message: string) {
  return { jsonrpc: "2.0" as const, error: { code, message }, id: null };
}

export async function runHttp(): Promise<void> {
  const baseUrl = getBaseUrl();
  const fallbackCreds = envCredentials();
  const port = Number(process.env.PORT ?? 3000);

  const app = express();
  app.use(express.json({ limit: "4mb" }));

  // Active sessions keyed by the server-generated session id.
  const transports: Record<string, StreamableHTTPServerTransport> = {};

  app.post(MCP_PATH, async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport = sessionId ? transports[sessionId] : undefined;

    if (!transport) {
      // Only a fresh initialize request may start a new session.
      if (!isInitializeRequest(req.body)) {
        res.status(400).json(jsonRpcError(-32000, "Bad Request: No valid session ID provided"));
        return;
      }

      // Authenticate this session from headers, falling back to env creds.
      const creds = credentialsFromHeaders(req.headers) ?? fallbackCreds;
      if (!creds) {
        res
          .status(401)
          .json(
            jsonRpcError(
              -32001,
              "Unauthorized: provide Repliz credentials via 'Authorization: Basic <base64(accessKey:secretKey)>' or 'X-Repliz-Access-Key' + 'X-Repliz-Secret-Key' headers."
            )
          );
        return;
      }

      const client = new ReplizClient({ ...creds, baseUrl });
      const server = createReplizServer(client);

      const newTransport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sid) => {
          transports[sid] = newTransport;
        },
      });
      newTransport.onclose = () => {
        if (newTransport.sessionId) delete transports[newTransport.sessionId];
      };

      await server.connect(newTransport);
      transport = newTransport;
    }

    await transport.handleRequest(req, res, req.body);
  });

  // GET (server-sent events stream) and DELETE (session teardown) reuse a session.
  const handleSessionRequest = async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    const transport = sessionId ? transports[sessionId] : undefined;
    if (!transport) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }
    await transport.handleRequest(req, res);
  };

  app.get(MCP_PATH, handleSessionRequest);
  app.delete(MCP_PATH, handleSessionRequest);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", baseUrl, sessions: Object.keys(transports).length });
  });

  app.listen(port, () => {
    console.error(
      `Repliz MCP server running (HTTP Streamable on :${port}${MCP_PATH}, base URL: ${baseUrl}).` +
        (fallbackCreds ? " Env credentials available as fallback." : " Per-user header credentials required.")
    );
  });
}
