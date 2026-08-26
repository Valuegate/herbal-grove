import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User Conversations
  conversations: defineTable({
    userId: v.string(),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant")
    ),
    content: v.string(),
    createdAt: v.number(),
    source: v.optional(
      v.union(
        v.literal("rag"),
        v.literal("llm")
      )
    ),
    references: v.optional(
      v.array(
        v.object({
          text: v.string(),
          similarity: v.float64(),
          documentId: v.id("documents"),
          page: v.optional(v.number()),
        })
      )
    ),
  }).index("by_conversation", ["conversationId"]),

  // Herbs
  herbs: defineTable({
    scientificName: v.string(),
    commonNames: v.array(v.string()),
    aliases: v.array(v.string()),
    family: v.optional(v.string()),
    genus: v.optional(v.string()),
    species: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    tags: v.array(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("verified")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_scientific_name", ["scientificName"]),

  // Sources
  sources: defineTable({
    name: v.string(),
    type: v.union(
      v.literal("journal"),
      v.literal("research_institute"),
      v.literal("government"),
      v.literal("traditional"),
      v.literal("other")
    ),
    url: v.optional(v.string()),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Uploaded Documents
  documents: defineTable({
    title: v.string(),
    content: v.optional(v.string()),
    originalFileName: v.string(),
    uploadedBy: v.string(), // Clerk userId
    storageProvider: v.literal("cloudinary"),
    storageId: v.string(),
    fileUrl: v.string(),
    verificationStatus: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("outdated")
    ),
    ingestionStatus: v.union(
      v.literal("uploaded"),
      v.literal("processing"),
      v.literal("indexed"),
      v.literal("failed")
    ),
    summary: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["ingestionStatus"])
    .index("by_verification", ["verificationStatus"])
    .index("by_uploaded_by", ["uploadedBy"]),

  // Document and Herb
  documentHerbs: defineTable({
    documentId: v.id("documents"),
    herbId: v.id("herbs"),
    relevance: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_document", ["documentId"])
    .index("by_herb", ["herbId"])
    .index("by_document_and_herb", [
      "documentId",
      "herbId",
    ]),

  // Document and Source
  documentSources: defineTable({
    documentId: v.id("documents"),
    sourceId: v.id("sources"),
    createdAt: v.number(),
    })
    .index("by_document", ["documentId"])
    .index("by_source", ["sourceId"])
    .index("by_document_and_source", [
      "documentId",
      "sourceId",
    ]),

  //Save Documents
  saveDocuments: defineTable({
    userId: v.string(),
    documentId: v.id("documents"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_document", ["documentId"])
    .index("by_user_and_document", ["userId", "documentId"]),

  // Text Chunks and Embeddings
  chunks: defineTable({
    documentId: v.id("documents"),
    chunkIndex: v.number(),
    text: v.string(),
    embedding: v.array(v.number()),
    page: v.optional(v.number()),
    createdAt: v.number(),
    metadata: v.optional(
      v.object({
        section: v.optional(v.string()),
        heading: v.optional(v.string()),
      }),
    ),
  }).index("by_document", ["documentId"]),

  //Consultants
  consultants: defineTable({
    clerkId: v.string(),
    fullName: v.string(),
    specialization: v.optional(v.string()),
    email: v.string(),
    phoneNumber: v.optional(v.string()),
    gender: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    isOnline: v.boolean(),
  }).index("by_clerkId", ["clerkId"]),

  // Consultant Availability
  availableSlots: defineTable({
    consultantId: v.id("consultants"),
    startTime: v.number(),
    endTime: v.number(),
    status: v.union(
      v.literal("available"),
      v.literal("booked"),
      v.literal("blocked")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_consultant", ["consultantId"])
    .index("by_consultant_and_start", [
      "consultantId",
      "startTime",
    ]),

  consultantAvailability: defineTable({
    consultantId: v.id("consultants"),
    dayOfWeek: v.number(), // 0 = Sunday, 1 = Monday ... 6 = Saturday
    startTime: v.string(), // "09:00"
    endTime: v.string(),   // "12:00"
    isAvailable: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_consultant", ["consultantId"])
    .index("by_consultant_day", [
      "consultantId",
      "dayOfWeek",
    ]),

  // Consultations
  consultations: defineTable({
    userId: v.string(),
    userName: v.string(),
    userEmail: v.string(),
    consultantId: v.id("consultants"),
    slotId: v.id("availableSlots"),
    initialMessage: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("completed"),    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_consultant", ["consultantId"])
  .index("by_slot", ["slotId"])
  .index("by_user_consultant", ["userId", "consultantId"]),

  // Consultation Messages
  consultationMessages: defineTable({
    consultationId: v.id("consultations"),
    sender: v.union(
      v.literal("user"),
      v.literal("consultant"),
    ),
    content: v.string(),
    createdAt: v.number(),
  })
  .index("by_consultation", ["consultationId"]),

  // Consultants Certificates
  certificates: defineTable({
    consultantId: v.id("consultants"),
    title: v.string(),
    institution: v.string(),
    awardedDate: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_consultant", ["consultantId"]),

  careJournalNotes: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  careJournalDocuments: defineTable({
    userId: v.string(),
    title: v.string(),
    fileUrl: v.string(),
    storageProvider: v.string(),
    mimeType: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
});