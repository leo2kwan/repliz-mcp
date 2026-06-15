// Quick smoke test: spawn the built server over stdio, list its tools.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["dist/index.js"],
  env: {
    ...process.env,
    REPLIZ_ACCESS_KEY: "dummy_access",
    REPLIZ_SECRET_KEY: "dummy_secret",
    REPLIZ_BASE_URL: "https://api.repliz.com",
  },
});

const client = new Client({ name: "smoke-test", version: "1.0.0" });
await client.connect(transport);

const { tools } = await client.listTools();
console.log(`Connected. ${tools.length} tools registered:\n`);
for (const t of tools) {
  const req = Object.keys(t.inputSchema?.properties ?? {}).filter((k) =>
    (t.inputSchema?.required ?? []).includes(k)
  );
  console.log(`- ${t.name}  (required: ${req.join(", ") || "none"})`);
}

await client.close();
console.log("\nSmoke test OK.");
process.exit(0);
