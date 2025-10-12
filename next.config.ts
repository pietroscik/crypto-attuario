import { readFileSync } from "node:fs";
import path from "node:path";

const ampMetadataPath = path.join(__dirname, "data/amp-metadata.json");
const ampRuntimeCssPath = path.join(__dirname, "public/amp-runtime-v0.css");
const ampValidatorRulesPath = path.join(
  __dirname,
  "public/amp-validator-rules.json",
);

const ampMetadata = JSON.parse(readFileSync(ampMetadataPath, "utf8"));
const ampRuntimeCss = readFileSync(ampRuntimeCssPath, "utf8");
const ampValidatorRules = readFileSync(ampValidatorRulesPath, "utf8");

const defaultFetch = globalThis.fetch?.bind(globalThis);

const toUrlString = (input: any): string => {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  if (typeof input === "object" && input !== null && "url" in input) {
    const candidate = (input as { url?: unknown }).url;
    if (typeof candidate === "string") {
      return candidate;
    }
  }
  return String(input);
};

const resolveAmpAsset = (url: string) => {
  if (url.includes("/rtv/metadata")) {
    return new Response(JSON.stringify(ampMetadata), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (url.includes(`/rtv/${ampMetadata.ampRuntimeVersion}/v0.css`)) {
    return new Response(ampRuntimeCss, {
      status: 200,
      headers: { "Content-Type": "text/css" },
    });
  }

  if (url.includes("/v0/validator.json")) {
    return new Response(ampValidatorRules, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return null;
};

if (defaultFetch) {
  globalThis.fetch = (async (input: any, init?: any) => {
    const url = toUrlString(input);
    const resolved = resolveAmpAsset(url);
    if (resolved) {
      return resolved;
    }

    return defaultFetch(input as any, init);
  }) as typeof fetch;
}

const nextConfig = {
  experimental: {
    amp: {
      optimizer: {
        ampRuntimeVersion: ampMetadata.ampRuntimeVersion,
        ampRuntimeStyles: ampRuntimeCss,
        fetch: async (input: any, init?: any) => {
          const url = toUrlString(input);
          const resolved = resolveAmpAsset(url);
          if (resolved) {
            return resolved;
          }

          if (defaultFetch) {
            return defaultFetch(input as any, init);
          }

          throw new Error(`Unable to fetch AMP asset: ${url}`);
        },
      },
      validator: ampValidatorRulesPath,
      skipValidation: true,
    },
  },
};

export default nextConfig;
