export type ResearchDiscovery = {
  source: string;
  sourceUrl: string;
  sourceId?: string;

  title?: string;
  content: string;

  author?: string;
  publishedAt?: string;
  discoveredAt: string;

  topic: string;

  contentType?: string;
  evidenceType?: string;

  relevanceScore?: number;

  extractedHerbs: string[];

  images: {
    url: string;
    altText?: string;
  }[];

  status: "pending" | "approved" | "rejected";
};