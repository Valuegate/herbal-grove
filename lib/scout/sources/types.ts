export type DiscoveredContent = {
  source: string;
  sourceUrl: string;
  sourceId?: string;

  title?: string;
  content: string;

  author?: string;
  publishedAt?: string;

  images: {
    url: string;
    altText?: string;
  }[];
};