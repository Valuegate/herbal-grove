import "server-only";

import { ConvexHttpClient } from "convex/browser";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { ExtractedHerb } from "./extractHerbs";

export async function saveHerbs(
  convex: ConvexHttpClient,
  documentId: Id<"documents">,
  herbs: ExtractedHerb[]
) {
  for (const herb of herbs) {

    // Check if herb already exists
    const existingHerb = await convex.query(
      api.herbs.getHerbByScientificName,
      {
        scientificName: herb.scientificName,
      }
    );

    let herbId: Id<"herbs">;

    if (existingHerb) {
      herbId = existingHerb._id;
    } else {
      herbId = await convex.mutation(
        api.herbs.createHerb,
        {
          scientificName: herb.scientificName,
          commonNames: herb.commonNames,
          aliases: herb.aliases,
          family: herb.family,
          genus: herb.genus,
          species: herb.species,
          description: herb.description,
          tags: herb.tags,
        }
      );
    }

    // Avoid duplicate links
    const alreadyLinked = await convex.query(
      api.documentHerbs.documentHerbExists,
      {
        documentId,
        herbId,
      }
    );

    if (!alreadyLinked) {
      await convex.mutation(
        api.documentHerbs.linkDocumentToHerb,
        {
          documentId,
          herbId,
        }
      );
    }
  }
}