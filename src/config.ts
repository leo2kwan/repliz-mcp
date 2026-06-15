/**
 * Runtime configuration and credential resolution.
 *
 * The Repliz Public API uses HTTP Basic Auth:
 *   - Access Key -> username
 *   - Secret Key -> password
 *
 * Credentials can come from two places:
 *   - Environment variables (stdio / single-tenant hosting)
 *   - Per-request HTTP headers (multi-user remote hosting)
 */

export interface ReplizCredentials {
  accessKey: string;
  secretKey: string;
}

export interface ReplizConfig extends ReplizCredentials {
  baseUrl: string;
}

const DEFAULT_BASE_URL = "https://api.repliz.com";

/** The Repliz API base URL (shared by all users on a host). */
export function getBaseUrl(): string {
  return (process.env.REPLIZ_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

/** Load full config from env. Throws if credentials are missing (used by stdio). */
export function loadConfig(): ReplizConfig {
  const creds = envCredentials();
  if (!creds) {
    throw new Error(
      `Missing required environment variable(s): REPLIZ_ACCESS_KEY and/or REPLIZ_SECRET_KEY.\n` +
        `Set your Repliz API credentials before starting the server. See .env.example.`
    );
  }
  return { ...creds, baseUrl: getBaseUrl() };
}

/** Credentials from env, or null if not both present (used as HTTP fallback). */
export function envCredentials(): ReplizCredentials | null {
  const accessKey = process.env.REPLIZ_ACCESS_KEY?.trim();
  const secretKey = process.env.REPLIZ_SECRET_KEY?.trim();
  if (accessKey && secretKey) return { accessKey, secretKey };
  return null;
}

type HeaderBag = Record<string, string | string[] | undefined>;

function headerValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * Parse per-user Repliz credentials from request headers. Supports:
 *   - Authorization: Basic base64(accessKey:secretKey)   (mirrors Repliz's own auth)
 *   - X-Repliz-Access-Key + X-Repliz-Secret-Key           (explicit custom headers)
 * Returns null if no valid credential pair is found.
 */
export function credentialsFromHeaders(headers: HeaderBag): ReplizCredentials | null {
  const auth = headerValue(headers["authorization"]);
  if (auth && /^basic\s+/i.test(auth)) {
    const decoded = Buffer.from(auth.replace(/^basic\s+/i, "").trim(), "base64").toString("utf8");
    const idx = decoded.indexOf(":");
    if (idx > 0) {
      const accessKey = decoded.slice(0, idx);
      const secretKey = decoded.slice(idx + 1);
      if (accessKey && secretKey) return { accessKey, secretKey };
    }
  }

  const accessKey = headerValue(headers["x-repliz-access-key"])?.trim();
  const secretKey = headerValue(headers["x-repliz-secret-key"])?.trim();
  if (accessKey && secretKey) return { accessKey, secretKey };

  return null;
}
