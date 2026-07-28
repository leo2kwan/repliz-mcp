/** Account OAuth and Connection tools for Facebook, Instagram, Threads, YouTube, LinkedIn, TikTok, Shopee, and Twitter. */

import { z } from "zod";
import { registerTool, type ToolContext } from "./helpers.js";

export function registerAccountConnectTools(ctx: ToolContext): void {
  // ─── Facebook ─────────────────────────────────────────────────────────────

  registerTool(
    ctx,
    "repliz_authorize_facebook",
    {
      title: "Authorize Facebook",
      description: "Get Facebook OAuth authorization URL.",
      inputSchema: {
        redirect: z.string().describe("Redirect URL after authorization."),
      },
    },
    async (args) => ctx.client.get("/public/account/facebook/authorize", { redirect: args.redirect })
  );

  registerTool(
    ctx,
    "repliz_exchange_facebook",
    {
      title: "Exchange Facebook Code",
      description: "Exchange Facebook OAuth code for access token.",
      inputSchema: {
        code: z.string().describe("OAuth authorization code."),
      },
    },
    async (args) => ctx.client.post("/public/account/facebook/exchange", { code: args.code })
  );

  registerTool(
    ctx,
    "repliz_get_facebook_pages",
    {
      title: "Get Facebook Pages",
      description: "List Facebook pages accessible with the provided token.",
      inputSchema: {
        token: z.string().describe("Facebook access token."),
      },
    },
    async (args) => ctx.client.get("/public/account/facebook/page", { token: args.token })
  );

  registerTool(
    ctx,
    "repliz_connect_facebook",
    {
      title: "Connect Facebook Page",
      description: "Connect a Facebook Page account to Repliz.",
      inputSchema: {
        pageId: z.string().describe("Facebook Page ID."),
        token: z.string().describe("Facebook Access Token."),
      },
    },
    async (args) =>
      ctx.client.post("/public/account/facebook/connect", {
        pageId: args.pageId,
        token: args.token,
      })
  );

  registerTool(
    ctx,
    "repliz_reconnect_facebook",
    {
      title: "Reconnect Facebook Page",
      description: "Reconnect an existing Facebook Page account.",
      inputSchema: {
        accountId: z.string().describe("Repliz account ID."),
        pageId: z.string().describe("Facebook Page ID."),
        token: z.string().describe("Facebook Access Token."),
      },
    },
    async (args) =>
      ctx.client.post(`/public/account/facebook/connect/${encodeURIComponent(args.accountId)}`, {
        pageId: args.pageId,
        token: args.token,
      })
  );

  // ─── Instagram ────────────────────────────────────────────────────────────

  registerTool(
    ctx,
    "repliz_authorize_instagram",
    {
      title: "Authorize Instagram",
      description: "Get Instagram OAuth authorization URL.",
      inputSchema: {
        redirect: z.string().describe("Redirect URL after authorization."),
      },
    },
    async (args) => ctx.client.get("/public/account/instagram/authorize", { redirect: args.redirect })
  );

  registerTool(
    ctx,
    "repliz_connect_instagram",
    {
      title: "Connect Instagram",
      description: "Connect an Instagram account to Repliz using OAuth code.",
      inputSchema: {
        code: z.string().describe("OAuth authorization code."),
      },
    },
    async (args) => ctx.client.post("/public/account/instagram/connect", { code: args.code })
  );

  registerTool(
    ctx,
    "repliz_reconnect_instagram",
    {
      title: "Reconnect Instagram",
      description: "Reconnect an existing Instagram account.",
      inputSchema: {
        accountId: z.string().describe("Repliz account ID."),
        code: z.string().describe("OAuth authorization code."),
      },
    },
    async (args) =>
      ctx.client.post(`/public/account/instagram/connect/${encodeURIComponent(args.accountId)}`, {
        code: args.code,
      })
  );

  // ─── Threads ──────────────────────────────────────────────────────────────

  registerTool(
    ctx,
    "repliz_authorize_threads",
    {
      title: "Authorize Threads",
      description: "Get Threads OAuth authorization URL.",
      inputSchema: {
        redirect: z.string().describe("Redirect URL after authorization."),
      },
    },
    async (args) => ctx.client.get("/public/account/threads/authorize", { redirect: args.redirect })
  );

  registerTool(
    ctx,
    "repliz_connect_threads",
    {
      title: "Connect Threads",
      description: "Connect a Threads account to Repliz using OAuth code.",
      inputSchema: {
        code: z.string().describe("OAuth authorization code."),
      },
    },
    async (args) => ctx.client.post("/public/account/threads/connect", { code: args.code })
  );

  registerTool(
    ctx,
    "repliz_reconnect_threads",
    {
      title: "Reconnect Threads",
      description: "Reconnect an existing Threads account.",
      inputSchema: {
        accountId: z.string().describe("Repliz account ID."),
        code: z.string().describe("OAuth authorization code."),
      },
    },
    async (args) =>
      ctx.client.post(`/public/account/threads/connect/${encodeURIComponent(args.accountId)}`, {
        code: args.code,
      })
  );

  // ─── YouTube ──────────────────────────────────────────────────────────────

  registerTool(
    ctx,
    "repliz_authorize_youtube",
    {
      title: "Authorize YouTube",
      description: "Get YouTube OAuth authorization URL.",
      inputSchema: {
        redirect: z.string().describe("Redirect URL after authorization."),
      },
    },
    async (args) => ctx.client.get("/public/account/youtube/authorize", { redirect: args.redirect })
  );

  registerTool(
    ctx,
    "repliz_exchange_youtube",
    {
      title: "Exchange YouTube Code",
      description: "Exchange YouTube OAuth code for access token.",
      inputSchema: {
        code: z.string().describe("OAuth authorization code."),
      },
    },
    async (args) => ctx.client.post("/public/account/youtube/exchange", { code: args.code })
  );

  registerTool(
    ctx,
    "repliz_get_youtube_channels",
    {
      title: "Get YouTube Channels",
      description: "List YouTube channels accessible with the provided token.",
      inputSchema: {
        token: z.string().describe("YouTube access token."),
      },
    },
    async (args) => ctx.client.get("/public/account/youtube/channel", { token: args.token })
  );

  registerTool(
    ctx,
    "repliz_connect_youtube",
    {
      title: "Connect YouTube Channel",
      description: "Connect a YouTube channel account to Repliz.",
      inputSchema: {
        channelId: z.string().describe("YouTube channel ID."),
        token: z.string().describe("YouTube access token."),
      },
    },
    async (args) =>
      ctx.client.post("/public/account/youtube/connect", {
        channelId: args.channelId,
        token: args.token,
      })
  );

  registerTool(
    ctx,
    "repliz_reconnect_youtube",
    {
      title: "Reconnect YouTube Channel",
      description: "Reconnect an existing YouTube channel account.",
      inputSchema: {
        accountId: z.string().describe("Repliz account ID."),
        channelId: z.string().describe("YouTube channel ID."),
        token: z.string().describe("YouTube access token."),
      },
    },
    async (args) =>
      ctx.client.post(`/public/account/youtube/connect/${encodeURIComponent(args.accountId)}`, {
        channelId: args.channelId,
        token: args.token,
      })
  );

  // ─── LinkedIn ─────────────────────────────────────────────────────────────

  registerTool(
    ctx,
    "repliz_authorize_linkedin",
    {
      title: "Authorize LinkedIn",
      description: "Get LinkedIn OAuth authorization URL.",
      inputSchema: {
        redirect: z.string().describe("Redirect URL after authorization."),
      },
    },
    async (args) => ctx.client.get("/public/account/linkedin/authorize", { redirect: args.redirect })
  );

  registerTool(
    ctx,
    "repliz_exchange_linkedin",
    {
      title: "Exchange LinkedIn Code",
      description: "Exchange LinkedIn OAuth code for access token.",
      inputSchema: {
        code: z.string().describe("OAuth authorization code."),
      },
    },
    async (args) => ctx.client.post("/public/account/linkedin/exchange", { code: args.code })
  );

  registerTool(
    ctx,
    "repliz_get_linkedin_organizations",
    {
      title: "Get LinkedIn Organizations",
      description: "List LinkedIn organizations accessible with the provided token.",
      inputSchema: {
        token: z.string().describe("LinkedIn access token."),
      },
    },
    async (args) => ctx.client.get("/public/account/linkedin/organization", { token: args.token })
  );

  registerTool(
    ctx,
    "repliz_connect_linkedin",
    {
      title: "Connect LinkedIn Organization",
      description: "Connect a LinkedIn organization/profile account to Repliz.",
      inputSchema: {
        organizationId: z.string().describe("LinkedIn organization ID."),
        token: z.string().describe("LinkedIn access token."),
      },
    },
    async (args) =>
      ctx.client.post("/public/account/linkedin/connect", {
        organizationId: args.organizationId,
        token: args.token,
      })
  );

  registerTool(
    ctx,
    "repliz_reconnect_linkedin",
    {
      title: "Reconnect LinkedIn Organization",
      description: "Reconnect an existing LinkedIn organization/profile account.",
      inputSchema: {
        accountId: z.string().describe("Repliz account ID."),
        organizationId: z.string().describe("LinkedIn organization ID."),
        token: z.string().describe("LinkedIn access token."),
      },
    },
    async (args) =>
      ctx.client.post(`/public/account/linkedin/connect/${encodeURIComponent(args.accountId)}`, {
        organizationId: args.organizationId,
        token: args.token,
      })
  );

  // ─── TikTok ───────────────────────────────────────────────────────────────

  registerTool(
    ctx,
    "repliz_authorize_tiktok",
    {
      title: "Authorize TikTok",
      description: "Get TikTok OAuth authorization URL.",
      inputSchema: {
        redirect: z.string().describe("Redirect URL after authorization."),
      },
    },
    async (args) => ctx.client.get("/public/account/tiktok/authorize", { redirect: args.redirect })
  );

  registerTool(
    ctx,
    "repliz_connect_tiktok",
    {
      title: "Connect TikTok",
      description: "Connect a TikTok account to Repliz using OAuth code.",
      inputSchema: {
        code: z.string().describe("OAuth authorization code."),
      },
    },
    async (args) => ctx.client.post("/public/account/tiktok/connect", { code: args.code })
  );

  registerTool(
    ctx,
    "repliz_reconnect_tiktok",
    {
      title: "Reconnect TikTok",
      description: "Reconnect an existing TikTok account.",
      inputSchema: {
        accountId: z.string().describe("Repliz account ID."),
        code: z.string().describe("OAuth authorization code."),
      },
    },
    async (args) =>
      ctx.client.post(`/public/account/tiktok/connect/${encodeURIComponent(args.accountId)}`, {
        code: args.code,
      })
  );

  // ─── Shopee ───────────────────────────────────────────────────────────────

  registerTool(
    ctx,
    "repliz_authorize_shopee",
    {
      title: "Authorize Shopee",
      description: "Get Shopee OAuth authorization URL.",
      inputSchema: {
        redirect: z.string().describe("Redirect URL after authorization."),
      },
    },
    async (args) => ctx.client.get("/public/account/shopee/authorize", { redirect: args.redirect })
  );

  registerTool(
    ctx,
    "repliz_connect_shopee",
    {
      title: "Connect Shopee",
      description: "Connect a Shopee account to Repliz using OAuth code.",
      inputSchema: {
        code: z.string().describe("OAuth authorization code."),
      },
    },
    async (args) => ctx.client.post("/public/account/shopee/connect", { code: args.code })
  );

  registerTool(
    ctx,
    "repliz_reconnect_shopee",
    {
      title: "Reconnect Shopee",
      description: "Reconnect an existing Shopee account.",
      inputSchema: {
        accountId: z.string().describe("Repliz account ID."),
        code: z.string().describe("OAuth authorization code."),
      },
    },
    async (args) =>
      ctx.client.post(`/public/account/shopee/connect/${encodeURIComponent(args.accountId)}`, {
        code: args.code,
      })
  );

  // ─── Twitter ──────────────────────────────────────────────────────────────

  registerTool(
    ctx,
    "repliz_authorize_twitter",
    {
      title: "Authorize Twitter",
      description: "Get Twitter OAuth authorization URL.",
      inputSchema: {
        redirect: z.string().describe("Redirect URL after authorization."),
      },
    },
    async (args) => ctx.client.get("/public/account/twitter/authorize", { redirect: args.redirect })
  );

  registerTool(
    ctx,
    "repliz_connect_twitter",
    {
      title: "Connect Twitter",
      description: "Connect a Twitter account to Repliz using OAuth code.",
      inputSchema: {
        code: z.string().describe("OAuth authorization code."),
      },
    },
    async (args) => ctx.client.post("/public/account/twitter/connect", { code: args.code })
  );

  registerTool(
    ctx,
    "repliz_reconnect_twitter",
    {
      title: "Reconnect Twitter",
      description: "Reconnect an existing Twitter account.",
      inputSchema: {
        accountId: z.string().describe("Repliz account ID."),
        code: z.string().describe("OAuth authorization code."),
      },
    },
    async (args) =>
      ctx.client.post(`/public/account/twitter/connect/${encodeURIComponent(args.accountId)}`, {
        code: args.code,
      })
  );
}
