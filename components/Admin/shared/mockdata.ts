import { Herb } from "./types";

export const mockHerbs: Herb[] = [
  {
    id: "1",
    commonName: "Turmeric",
    scientificName: "Curcuma longa",
    documentCount: 12,
    status: "verified" as const,
  },
  {
    id: "2",
    commonName: "Neem",
    scientificName: "Azadirachta indica",
    documentCount: 8,
    status: "verified" as const,
  },
  {
    id: "3",
    commonName: "Ginger",
    scientificName: "Zingiber officinale",
    documentCount: 15,
    status: "verified" as const,
  },
  {
    id: "4",
    commonName: "Ashwagandha",
    scientificName: "Withania somnifera",
    documentCount: 4,
    status: "pending" as const,
  },
  {
    id: "5",
    commonName: "Moringa",
    scientificName: "Moringa oleifera",
    documentCount: 6,
    status: "verified" as const,
  },
  {
    id: "6",
    commonName: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    documentCount: 5,
    status: "verified" as const,
  },
  {
    id: "7",
    commonName: "Holy Basil",
    scientificName: "Ocimum tenuiflorum",
    documentCount: 3,
    status: "pending" as const,
  },
];