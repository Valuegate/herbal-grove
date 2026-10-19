"use client";

import { useState } from "react";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";

import UploadButton from "@/components/Admin/knowledge-base/UploadButton";
import UploadDocumentModal from "./knowledge-base/UploadDocumentModal";
import SearchBar from "@/components/Admin/knowledge-base/SearchBar";
import DocumentTable from "@/components/Admin/knowledge-base/DocumentTable";

type KnowledgeTab = "documents" | "scout";
type ScoutTab = "pending" | "approved";
type Discovery = Doc<"researchDiscoveries">;

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
        active ? "border-green-700 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function DiscoveryCard({ discovery, actions }: { discovery: Discovery; actions: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h5 className="font-semibold text-gray-900">{discovery.title || "Untitled discovery"}</h5>
          <p className="text-sm text-gray-500 mt-1">{discovery.source}</p>
        </div>

        <div className="text-sm text-gray-500">Relevance: {Math.round(discovery.relevanceScore * 100)}%</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {discovery.plants.map((plant) => (
          <span key={plant} className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
            {plant}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500">Content type:</span>{" "}
          <span className="font-medium">{discovery.contentType}</span>
        </div>
        <div>
          <span className="text-gray-500">Evidence:</span>{" "}
          <span className="font-medium">{discovery.evidenceType}</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-3">{discovery.content}</p>

      <div className="flex flex-wrap gap-3">
        <a
          href={discovery.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
        >
          View Source
        </a>
        {actions}
      </div>
    </div>
  );
}

function DiscoverySection({
  title,
  discoveries,
  loadingText,
  emptyText,
  renderActions,
}: {
  title: string;
  discoveries: Discovery[] | undefined;
  loadingText: string;
  emptyText: string;
  renderActions: (discovery: Discovery) => React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{title}</h4>
        <span className="text-sm text-gray-500">{discoveries ? discoveries.length : "..."}</span>
      </div>

      {discoveries === undefined ? (
        <div className="border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">{loadingText}</p>
        </div>
      ) : discoveries.length === 0 ? (
        <div className="border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {discoveries.map((discovery) => (
            <DiscoveryCard key={discovery._id} discovery={discovery} actions={renderActions(discovery)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function KnowledgeBase() {
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<KnowledgeTab>("documents");
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlMessage, setCrawlMessage] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [scoutTab, setScoutTab] = useState<ScoutTab>("pending");

  const pendingDiscoveries = useQuery(api.researchDiscoveries.getPendingDiscoveries);
  const approvedDiscoveries = useQuery(api.researchDiscoveries.getApprovedDiscoveries);
  const rejectDiscovery = useMutation(api.researchDiscoveries.rejectDiscovery);
  const removeApprovedDiscovery = useMutation(api.researchDiscoveries.removeApprovedDiscovery);

  async function handleCrawl() {
    try {
      setIsCrawling(true);
      setCrawlMessage(null);

      const response = await fetch("/api/scout", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Research Scout crawl failed.");
      }

      const result = data.result;
      setCrawlMessage(
        `Crawl complete. Found ${result.discovered} candidates, saved ${result.saved}, skipped ${result.skippedExisting} existing and ${result.skippedIrrelevant} irrelevant. ${result.failed} failed.`
      );
    } catch (error) {
      setCrawlMessage(error instanceof Error ? error.message : "Research Scout crawl failed.");
    } finally {
      setIsCrawling(false);
    }
  }

  // Runs a review mutation (approve/reject/remove) while tracking which
  // discovery is currently being acted on, for per-card disabled states.
  async function runReview(discoveryId: Id<"researchDiscoveries">, mutate: (id: Id<"researchDiscoveries">) => Promise<unknown>) {
    try {
      setReviewingId(discoveryId);
      await mutate(discoveryId);
    } finally {
      setReviewingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Knowledge Base</h2>
        <p className="text-gray-500 mt-1">
          Manage research papers and research intelligence used by the HerbaGrove AI.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          <TabButton active={activeTab === "documents"} onClick={() => setActiveTab("documents")}>
            Documents
          </TabButton>
          <TabButton active={activeTab === "scout"} onClick={() => setActiveTab("scout")}>
            Research Scout
          </TabButton>
        </div>
      </div>

      {/* Documents */}
      {activeTab === "documents" && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <SearchBar value={search} onChange={setSearch} />
            <UploadButton onClick={() => setOpenUploadModal(true)} />
            <UploadDocumentModal open={openUploadModal} onClose={() => setOpenUploadModal(false)} />
          </div>

          <DocumentTable search={search} />
        </div>
      )}

      {/* Research Scout */}
      {activeTab === "scout" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Research Scout</h3>
              <p className="text-sm text-gray-500 mt-1">
                Discover plant-related research and discussions from external sources for review and AI use.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCrawl}
              disabled={isCrawling}
              className="px-5 py-2.5 rounded-lg bg-green-700 text-white text-sm font-medium disabled:opacity-50"
            >
              {isCrawling ? "Crawling..." : "Crawl Now"}
            </button>
          </div>

          {crawlMessage && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-700">{crawlMessage}</p>
            </div>
          )}

          <div className="border-b border-gray-200">
            <div className="flex gap-6">
              <TabButton active={scoutTab === "pending"} onClick={() => setScoutTab("pending")}>
                Pending Review{pendingDiscoveries && <span className="ml-2">({pendingDiscoveries.length})</span>}
              </TabButton>
              <TabButton active={scoutTab === "approved"} onClick={() => setScoutTab("approved")}>
                Approved{approvedDiscoveries && <span className="ml-2">({approvedDiscoveries.length})</span>}
              </TabButton>
            </div>
          </div>

          {scoutTab === "pending" && (
            <DiscoverySection
              title="Pending Review"
              discoveries={pendingDiscoveries}
              loadingText="Loading discoveries..."
              emptyText="No pending discoveries."
              renderActions={(discovery) => (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      runReview(discovery._id, async (id) => {
                        const response = await fetch("/api/scout/approve", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              discoveryId: id,
                            }),
                          }
                        );
                        const data = await response.json();

                        if (!response.ok) {
                          throw new Error(
                            data.details ||
                              data.error ||
                              "Failed to approve discovery."
                          );
                        }
                        return data;
                      })
                    }
                    disabled={reviewingId === discovery._id}
                    className="px-4 py-2 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-800 disabled:opacity-50"
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => runReview(discovery._id, (id) => rejectDiscovery({ discoveryId: id }))}
                    disabled={reviewingId === discovery._id}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </>
              )}
            />
          )}

          {scoutTab === "approved" && (
            <DiscoverySection
              title="Approved Discoveries"
              discoveries={approvedDiscoveries}
              loadingText="Loading approved discoveries..."
              emptyText="No approved discoveries yet."
              renderActions={(discovery) => (
                <button
                  type="button"
                  onClick={() => runReview(discovery._id, (id) => removeApprovedDiscovery({ discoveryId: id }))}
                  disabled={reviewingId === discovery._id}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {reviewingId === discovery._id ? "Removing..." : "Remove"}
                </button>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}