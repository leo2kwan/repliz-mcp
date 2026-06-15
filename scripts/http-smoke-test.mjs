// Smoke test for HTTP (Streamable) transport with per-user header auth.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const URL_MCP = "http://localhost:3344/mcp";

async function connect(headers) {
  const transport = new StreamableHTTPClientTransport(new URL(URL_MCP), {
    requestInit: { headers },
  });
  const client = new Client({ name: "http-smoke", version: "1.0.0" });
  await client.connect(transport);
  return client;
}

// 1) No credentials -> expect failure at initialize.
console.log("[1] connect WITHOUT credentials (expect 401)...");
try {
  await connect({});
  console.log("    UNEXPECTED: connected without creds");
  process.exit(1);
} catch (err) {
  console.log("    OK, rejected:", (err?.message || String(err)).split("\n")[0]);
}

// 2) With per-user header credentials -> expect success.
console.log("[2] connect WITH header credentials...");
const client = await connect({
  "X-Repliz-Access-Key": "dummy_access",
  "X-Repliz-Secret-Key": "dummy_secret",
});
const { tools } = await client.listTools();
console.log(`    OK, connected. ${tools.length} tools.`);

// 3) Call a tool -> real API returns graceful 401 (dummy creds).
console.log("[3] call repliz_count_accounts...");
const res = await client.callTool({ name: "repliz_count_accounts", arguments: {} });
console.log("    isError:", res.isError);
console.log("    content:", (res.content?.[0]?.text || "").replace(/\n/g, " "));

await client.close();
console.log("\nHTTP smoke test OK.");
process.exit(0);
