"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useUIStateContext } from "@/components/UIStateContext";

import CertificateCard from "./CertificateCard";
import CertificateModal from "./CertificateModal";

type CertificateForm = {
  title: string;
  institution: string;
  awardedDate: string;
};

type Certificate = CertificateForm & { _id: Id<"certificates"> };

export default function CertificatesSection() {
  const { darkMode } = useUIStateContext();
  const { user } = useUser();

  const consultant = useQuery(
    api.consultants.getCurrentConsultant,
    user ? { clerkId: user.id } : "skip"
  );

  const certificates = useQuery(
    api.certificates.getCertificates,
    consultant ? { consultantId: consultant._id } : "skip"
  );

  const addCertificate = useMutation(api.certificates.addCertificate);
  const updateCertificate = useMutation(api.certificates.updateCertificate);
  const deleteCertificate = useMutation(api.certificates.deleteCertificate);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);

  const cardClass = `rounded-3xl border p-8 ${
    darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-gray-200"
  }`;
  const mutedClass = darkMode ? "text-neutral-400" : "text-gray-500";

  if (consultant === undefined || certificates === undefined) {
    return <div className={cardClass}>Loading...</div>;
  }

  function closeModal() {
    setModalOpen(false);
    setEditingCertificate(null);
  }

  function openModal(certificate: Certificate | null) {
    setEditingCertificate(certificate);
    setModalOpen(true);
  }

  async function handleSubmit(values: CertificateForm) {
    if (!consultant) return;

    try {
      setLoading(true);

      if (editingCertificate) {
        await updateCertificate({ certificateId: editingCertificate._id, ...values });
      } else {
        await addCertificate({ consultantId: consultant._id, ...values });
      }

      closeModal();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(certificateId: Id<"certificates">) {
    if (!window.confirm("Delete this certificate?")) return;
    await deleteCertificate({ certificateId });
  }

  return (
    <>
      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Certificates</h2>
            <p className={`mt-1 ${mutedClass}`}>Manage your professional qualifications.</p>
          </div>

          <button
            type="button"
            onClick={() => openModal(null)}
            className="flex items-center gap-2 rounded-xl bg-[#2b7a2d] px-5 py-3 text-white hover:bg-[#236626]"
          >
            <Plus size={18} />
            Add Certificate
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {certificates.length === 0 ? (
            <div
              className={`rounded-2xl border border-dashed p-10 text-center ${
                darkMode ? "border-neutral-700 bg-neutral-800/40" : "border-gray-300 bg-gray-50"
              }`}
            >
              <h3 className="text-lg font-semibold">No certificates yet</h3>
              <p className={`mt-2 ${mutedClass}`}>
                Add your first certificate to showcase your qualifications.
              </p>
            </div>
          ) : (
            certificates.map((certificate) => (
              <CertificateCard
                key={certificate._id}
                certificate={certificate}
                onEdit={() => openModal(certificate)}
                onDelete={() => handleDelete(certificate._id)}
              />
            ))
          )}
        </div>
      </div>

      <CertificateModal
        open={modalOpen}
        loading={loading}
        initialValues={editingCertificate ?? undefined}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}