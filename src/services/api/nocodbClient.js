const API_TOKEN = import.meta.env.VITE_NOCODB_TOKEN;

const URLS = {
  hotspots:     import.meta.env.VITE_NOCODB_URL,
  buildings:    import.meta.env.VITE_NOCODB_BUILDINGS_URL,
  images:       import.meta.env.VITE_NOCODB_IMAGES_URL,
  publications: import.meta.env.VITE_NOCODB_PUBLICATIONS_URL,
};

// ─── helpers ────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Fetch one NocoDB table with automatic retry on 429.
 * Retries up to MAX_RETRIES times, doubling the wait each attempt.
 */
async function request(tableKey, { retries = 4, baseDelay = 800 } = {}) {
  const url = URLS[tableKey];

  if (!url) {
    throw new Error(
      `nocodbClient: no URL configured for "${tableKey}". ` +
      `Add VITE_NOCODB_${tableKey.toUpperCase()}_URL to your .env file.`
    );
  }

  let attempt = 0;

  while (true) {
    const res = await fetch(url, {
      headers: { "xc-token": API_TOKEN },
    });

    if (res.ok) {
      return await res.json();
    }

    if (res.status === 429 && attempt < retries) {
      // Respect Retry-After header if present, otherwise use exponential back-off
      const retryAfter = res.headers.get("Retry-After");
      const wait = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : baseDelay * Math.pow(2, attempt);   // 800 → 1600 → 3200 → 6400 ms

      console.warn(
        `NocoDB rate limit hit for "${tableKey}". ` +
        `Retrying in ${wait}ms (attempt ${attempt + 1}/${retries})…`
      );

      await sleep(wait);
      attempt++;
      continue;
    }

    // Non-429 error, or retries exhausted
    const text = await res.text();
    console.error("NocoDB ERROR BODY:", text);
    throw new Error(`NocoDB error: ${res.status} for "${tableKey}"`);
  }
}

// ─── staggered batch helper ──────────────────────────────────────────────────

/**
 * Run an array of async factories sequentially with a small gap between each.
 * This prevents all requests from landing simultaneously and triggering 429s.
 *
 * Usage:
 *   const [hotspots, buildings] = await staggered([
 *     () => nocodbClient.getHotspots(),
 *     () => nocodbClient.getBuildings(),
 *   ]);
 */
export async function staggered(factories, gap = 300) {
  const results = [];
  for (const factory of factories) {
    results.push(await factory());
    if (factories.indexOf(factory) < factories.length - 1) {
      await sleep(gap);
    }
  }
  return results;
}

// ─── public client ───────────────────────────────────────────────────────────

export const nocodbClient = {
  getHotspots:     () => request("hotspots"),
  getBuildings:    () => request("buildings"),
  getImages:       () => request("images"),
  getPublications: () => request("publications"),
};