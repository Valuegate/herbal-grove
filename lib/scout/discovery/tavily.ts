import "server-only";

type TavilyResult = {
  title: string;
  url: string;
  content: string;
  score: number;
  publishedDate?: string;
};

type TavilyResponse = {
  results?: TavilyResult[];
};

export type ScoutCandidate = {
  title: string;
  url: string;
  preview: string;
  score: number;
  publishedAt?: string;
};

const SCOUT_QUERIES = [
  "medicinal plants herbal medicine research",
  "medicinal herbs clinical research safety",
  "ethnobotany traditional medicinal plants",
  "herbal medicine pharmacology medicinal plants",
];

export async function discoverResearchCandidates(): Promise<
  ScoutCandidate[]
> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not configured.");
  }

  const searches = await Promise.all(
    SCOUT_QUERIES.map(async (query) => {
      const response = await fetch(
        "https://api.tavily.com/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: apiKey,
            query,

            // We only need discovery here.
            // HerbaGrove will perform its own classification.
            search_depth: "basic",
            max_results: 5,
            include_answer: false,
            include_raw_content: false,
          }),
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          `Tavily search failed (${response.status}): ${message}`
        );
      }

      const data =
        (await response.json()) as TavilyResponse;

      return data.results ?? [];
    })
  );

  const results = searches.flat();

  // Multiple queries may discover the same page.
  const uniqueResults = new Map<
    string,
    ScoutCandidate
  >();

  for (const result of results) {
    if (!result.url) {
      continue;
    }

    let normalizedUrl: string;

    try {
      const url = new URL(result.url);

      // Tracking parameters shouldn't make the same
      // research page look like a different discovery.
      url.hash = "";

      normalizedUrl = url.toString();
    } catch {
      continue;
    }

    const existing =
      uniqueResults.get(normalizedUrl);

    if (
      !existing ||
      result.score > existing.score
    ) {
      uniqueResults.set(normalizedUrl, {
        title: result.title,
        url: normalizedUrl,
        preview: result.content,
        score: result.score,
        publishedAt: result.publishedDate,
      });
    }
  }

  return Array.from(uniqueResults.values()).sort(
    (a, b) => b.score - a.score
  );
}