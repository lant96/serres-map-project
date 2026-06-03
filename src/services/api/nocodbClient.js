const API_TOKEN = import.meta.env.VITE_NOCODB_TOKEN;

const URLS = {
  hotspots:     import.meta.env.VITE_NOCODB_URL,
  buildings:    import.meta.env.VITE_NOCODB_BUILDINGS_URL,
  images:       import.meta.env.VITE_NOCODB_IMAGES_URL,
  publications: import.meta.env.VITE_NOCODB_PUBLICATIONS_URL,
};


const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function request(tableKey, { retries = 4, baseDelay = 800 } = {}) {
  const baseUrl = URLS[tableKey];

  const separator = baseUrl.includes("?") ? "&" : "?";

  const url = `${baseUrl}${separator}limit=1000`;

  if (!baseUrl) {
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
      const retryAfter = res.headers.get("Retry-After");
      const wait = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : baseDelay * Math.pow(2, attempt);   

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

export const nocodbClient = {
  getHotspots:     () => request("hotspots"),
  getBuildings:    () => request("buildings"),
  getImages:       () => request("images"),
  getPublications: () => request("publications"),
};