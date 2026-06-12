const API_TOKEN = import.meta.env.VITE_NOCODB_TOKEN;

const URLS = {
  hotspots:     import.meta.env.VITE_NOCODB_URL,
  buildings:    import.meta.env.VITE_NOCODB_BUILDINGS_URL,
  images:       import.meta.env.VITE_NOCODB_IMAGES_URL,
  publications: import.meta.env.VITE_NOCODB_PUBLICATIONS_URL,
};

const PAGE_SIZE = 100;
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Fetch a single page with retry on 429
async function fetchPage(baseUrl, offset, { retries = 4, baseDelay = 800 } = {}) {
  const separator = baseUrl.includes("?") ? "&" : "?";
  const url = `${baseUrl}${separator}limit=${PAGE_SIZE}&offset=${offset}`;

  let attempt = 0;

  while (true) {
    const res = await fetch(url, {
      headers: { "xc-token": API_TOKEN },
    });

    if (res.ok) return await res.json();

    if (res.status === 429 && attempt < retries) {
      const retryAfter = res.headers.get("Retry-After");
      const wait = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : baseDelay * Math.pow(2, attempt);

      console.warn(
        `NocoDB rate limit — retrying in ${wait}ms (attempt ${attempt + 1}/${retries})…`
      );
      await sleep(wait);
      attempt++;
      continue;
    }

    const text = await res.text();
    console.error("NocoDB ERROR BODY:", text);
    throw new Error(`NocoDB error: ${res.status}`);
  }
}

// Fetch ALL records across pages for a given table
async function fetchAll(tableKey) {
  const baseUrl = URLS[tableKey];

  if (!baseUrl) {
    throw new Error(
      `nocodbClient: no URL configured for "${tableKey}". ` +
      `Add VITE_NOCODB_${tableKey.toUpperCase()}_URL to your .env file.`
    );
  }

  let offset  = 0;
  let allRecords = [];

  while (true) {
    const data    = await fetchPage(baseUrl, offset);
    const records = data.records ?? data.list ?? [];
    const total   = data.pageInfo?.totalRows ?? data.totalRows ?? null;

    allRecords = allRecords.concat(records);

    if (records.length < PAGE_SIZE) break;
    if (total !== null && allRecords.length >= total) break;

    offset += PAGE_SIZE;

    await sleep(200);
  }

  return { records: allRecords };
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
  getHotspots:     () => fetchAll("hotspots"),
  getBuildings:    () => fetchAll("buildings"),
  getImages:       () => fetchAll("images"),
  getPublications: () => fetchAll("publications"),
};