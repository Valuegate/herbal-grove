import "server-only";

export type ExtractedPage = {
  url: string;
  content: string;
  images: {
    url: string;
    altText?: string;
  }[];
};

type TavilyExtractResult = {
  url: string;
  raw_content: string;
  images?: string[];
};

type TavilyExtractResponse = {
  results?: TavilyExtractResult[];
  failed_results?: {
    url: string;
    error?: string;
  }[];
};

export async function extractWithTavily(
  urls: string[]
): Promise<ExtractedPage[]> {
  if (urls.length === 0) {
    return [];
  }

  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not configured.");
  }

  const response = await fetch(
    "https://api.tavily.com/extract",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        urls,
        extract_depth: "basic",
        include_images: true,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      `Tavily extraction failed (${response.status}): ${message}`
    );
  }

  const data =
    (await response.json()) as TavilyExtractResponse;

  for (const failed of data.failed_results ?? []) {
    console.warn(
      `Tavily could not extract ${failed.url}:`,
      failed.error ?? "Unknown extraction error"
    );
  }

  return (data.results ?? [])
    .filter(
      (result) =>
        result.url &&
        result.raw_content?.trim()
    )
    .map((result) => ({
      url: result.url,
      content: result.raw_content.trim(),

      images: (result.images ?? []).map(
        (imageUrl) => ({
          url: imageUrl,
        })
      ),
    }));
}