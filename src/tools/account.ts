/** Account management tools. */

import { z } from "zod";
import { registerTool, type ToolContext } from "./helpers.js";

const PLATFORMS = ["facebook", "instagram", "threads", "tiktok", "linkedin", "youtube"] as const;

export function registerAccountTools(ctx: ToolContext): void {
  registerTool(
    ctx,
    "repliz_list_accounts",
    {
      title: "List Accounts",
      description:
        "List the social accounts connected to your Repliz workspace. Returns each account's id, platform, username, picture, and status. Supports pagination and filtering by platform type or search term.",
      inputSchema: {
        page: z.number().int().min(1).default(1).describe("Page number (1-based)."),
        limit: z.number().int().min(1).max(100).default(20).describe("Items per page."),
        types: z
          .array(z.enum(PLATFORMS))
          .optional()
          .describe("Filter by platform(s), e.g. [\"facebook\", \"instagram\"]."),
        search: z.string().optional().describe("Search by account name or username."),
      },
    },
    async (args) =>
      ctx.client.get("/public/account", {
        page: args.page,
        limit: args.limit,
        types: args.types,
        search: args.search,
      })
  );

  registerTool(
    ctx,
    "repliz_count_accounts",
    {
      title: "Count Accounts",
      description: "Get the total number of accounts connected to your Repliz workspace.",
      inputSchema: {},
    },
    async () => ctx.client.get("/public/account/count")
  );

  registerTool(
    ctx,
    "repliz_get_account",
    {
      title: "Get Account",
      description: "Get details of a single connected account by its Repliz account id.",
      inputSchema: {
        accountId: z.string().describe("The Repliz account id (e.g. 680affa5ce12f2f72916f67e)."),
      },
    },
    async (args) => ctx.client.get(`/public/account/${encodeURIComponent(args.accountId)}`)
  );

  registerTool(
    ctx,
    "repliz_get_account_statistics",
    {
      title: "Get Account Statistics",
      description:
        "Retrieve aggregated statistics and activity metrics for a specific connected account, including platform-specific overview metrics.",
      inputSchema: {
        accountId: z.string().describe("The Repliz account id (e.g. 680affa5ce12f2f72916f67e)."),
      },
    },
    async (args) => ctx.client.get(`/public/account/${encodeURIComponent(args.accountId)}/statistic`)
  );

  registerTool(
    ctx,
    "repliz_delete_account",
    {
      title: "Delete Account",
      description:
        "Disconnect and remove an account from your Repliz workspace. This is irreversible — confirm with the user before calling.",
      inputSchema: {
        accountId: z.string().describe("The Repliz account id to remove."),
      },
    },
    async (args) => ctx.client.delete(`/public/account/${encodeURIComponent(args.accountId)}`)
  );
}
