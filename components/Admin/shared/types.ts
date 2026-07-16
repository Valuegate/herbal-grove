export interface Herb {
  id: string;
  commonName: string;
  scientificName: string;
  documentCount: number;
  status: "verified" | "pending";
}