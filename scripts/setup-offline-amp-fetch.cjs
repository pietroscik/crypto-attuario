const fs = require("node:fs")
const path = require("node:path")

const ampAssetsDir = path.join(process.cwd(), "data", "amp")

if (process.env.DEBUG_AMP_OFFLINE === "1") {
  console.log("[offline-amp] installing fetch shim in pid", process.pid)
}

const readAsset = (file) => fs.readFileSync(path.join(ampAssetsDir, file), "utf8")

const metadataPayload = readAsset("metadata.json")
const metadata = JSON.parse(metadataPayload)
const runtimeCss = readAsset("v0.css")
const validatorPayload = readAsset("validator.json")
const versionTxt = readAsset("version.txt")
const bundlesExtensionsPayload = readAsset("bundles.config.extensions.json")
const bundlesConfigPayload = readAsset("bundles.config.json")
const componentsConfigPayload = readAsset("components.json")

const ampCssUrl = new URL(metadata.ampCssUrl)
const knownRuntimeCssPaths = new Set([
  ampCssUrl.pathname,
  ...(Array.isArray(metadata.diversions)
    ? metadata.diversions.map((version) => `/rtv/${version}/v0.css`)
    : []),
])

if (metadata.ltsRuntimeVersion) {
  knownRuntimeCssPaths.add(`/rtv/${metadata.ltsRuntimeVersion}/v0.css`)
}

const createResponse = (body, contentType) =>
  new Response(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
    },
  })

const resolveOfflineAmpResponse = (requestUrl) => {
  if (requestUrl.hostname !== "cdn.ampproject.org" && requestUrl.hostname !== "raw.githubusercontent.com") {
    return null
  }

  if (requestUrl.hostname === "cdn.ampproject.org") {
    if (requestUrl.pathname === "/rtv/metadata") {
      return createResponse(metadataPayload, "application/json")
    }

    if (requestUrl.pathname === "/version.txt") {
      return createResponse(versionTxt, "text/plain")
    }

    if (requestUrl.pathname === "/v0/validator.json") {
      return createResponse(validatorPayload, "application/json")
    }

    if (knownRuntimeCssPaths.has(requestUrl.pathname) || requestUrl.pathname.endsWith("/v0.css")) {
      return createResponse(runtimeCss, "text/css")
    }
  }

  if (requestUrl.hostname === "raw.githubusercontent.com") {
    if (requestUrl.pathname.endsWith("/bundles.config.extensions.json")) {
      return createResponse(bundlesExtensionsPayload, "application/json")
    }

    if (requestUrl.pathname.endsWith("/bundles.config.json")) {
      return createResponse(bundlesConfigPayload, "application/json")
    }

    if (requestUrl.pathname.endsWith("/components.json")) {
      return createResponse(componentsConfigPayload, "application/json")
    }
  }

  return null
}

const originalFetch = globalThis.fetch

globalThis.fetch = async function offlineAmpFetch(input, init) {
  const requestUrl = typeof input === "string" ? new URL(input) : new URL(input.url)
  if (process.env.DEBUG_AMP_OFFLINE === "1") {
    console.log("[offline-amp] request:", requestUrl.toString())
  }
  const offlineResponse = resolveOfflineAmpResponse(requestUrl)

  if (offlineResponse) {
    if (process.env.DEBUG_AMP_OFFLINE === "1") {
      console.log("[offline-amp] Serving:", requestUrl.toString())
    }
    return offlineResponse
  }

  if (!originalFetch) {
    throw new Error(`No network fetch available for ${requestUrl.toString()}`)
  }

  return originalFetch(input, init)
}

try {
  const optimizerMod = require("next/dist/compiled/@ampproject/toolbox-optimizer")
  optimizerMod.DEFAULT_CONFIG.fetch = globalThis.fetch
  if (optimizerMod.NodeUtils && typeof optimizerMod.NodeUtils === "object") {
    optimizerMod.NodeUtils.fetch = globalThis.fetch
  }
  if (process.env.DEBUG_AMP_OFFLINE === "1") {
    console.log("[offline-amp] patched optimizer defaults")
  }
} catch (error) {
  if (process.env.DEBUG_AMP_OFFLINE === "1") {
    console.log("[offline-amp] unable to patch optimizer immediately:", error.message)
  }
}
