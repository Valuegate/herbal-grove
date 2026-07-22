"use client";

import { useState } from "react";

import UploadButton from "@/components/Admin/knowledge-base/UploadButton";
import UploadDocumentModal from "./knowledge-base/UploadDocumentModal";
import SearchBar from "@/components/Admin/knowledge-base/SearchBar";
import DocumentTable from "@/components/Admin/knowledge-base/DocumentTable";

export default function KnowledgeBase() {
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Knowledge Base</h2>
        <p className="text-gray-500 mt-1">
          Manage research papers used by the HerbaGrove AI.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <SearchBar value={search} onChange={setSearch} />
        <UploadButton
          onClick={() => setOpenUploadModal(true)}
        />

        <UploadDocumentModal
          open={openUploadModal}
          onClose={() => setOpenUploadModal(false)}
        />
      </div>

      <DocumentTable search={search} />
    </div>
  );
}