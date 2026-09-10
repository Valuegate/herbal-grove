"use client";

import { useRef, useState } from "react";
import { Camera, Image as ImageIcon, RotateCcw, Search } from "lucide-react";

interface PlantMatch {
  commonName: string | null;
  scientificName: string | null;
  probability: number;
  gbifId: string | null;
  powoId: string | null;
}

interface TopMatch extends PlantMatch {
  commonNames: string[];
  genus: string | null;
  family: string | null;
}

interface HerbProfile {
  description: string;
  traditionalUses: string[];
  potentialBenefits: string[];
  safetyConsiderations: string[];
}

interface IdentificationResult {
  isPlant: boolean;
  topMatch: TopMatch | null;
  alternatives: PlantMatch[];
  herbProfile: HerbProfile | null;
}

const cardClass = "rounded-2xl border border-gray-200 bg-white shadow-sm";
const statBoxClass = "rounded-xl bg-gray-50 p-4";

function formatProbability(probability: number) {
  return `${Math.round(probability * 100)}%`;
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className={statBoxClass}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

export default function IdentifyPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file?: File) {
    if (!file) return;

    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImage(reader.result);
    };
    reader.onerror = () => setError("Failed to load the image.");
    reader.readAsDataURL(file);
  }

  async function identifyHerb() {
    if (!image) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64 = image.split(",")[1];

      const response = await fetch("/api/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Plant identification failed.");

      setResult(data);
    } catch (error) {
      console.error("Identification error:", error);
      setError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setImage(null);
    setResult(null);
    setError(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  return (
    <main className="min-h-screen px-4 py-6 pb-24 md:px-8 md:pb-8">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Identify Herb 🌿</h1>
          <p className="mt-2 text-sm text-gray-500">
            Take a clear photo of a herb or upload an existing image to identify it.
          </p>
        </div>

        {/* Image Area */}
        <div className={`overflow-hidden ${cardClass}`}>
          {image ? (
            <div className="relative">
              <img src={image} alt="Selected plant" className="h-80 w-full object-cover" />

              <button
                type="button"
                onClick={reset}
                className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition hover:bg-black/80"
                aria-label="Reset image"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          ) : (
            <div className="flex h-80 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 rounded-full bg-[#2B7A2D]/10 p-5">
                <Camera size={40} className="text-[#2B7A2D]" />
              </div>
              <h2 className="text-lg font-semibold">Identify a herb</h2>
              <p className="mt-2 max-w-sm text-sm text-gray-500">
                Take a photo or choose an image from your device.
              </p>
            </div>
          )}
        </div>

        {/* Image Inputs */}
        {!image && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#2B7A2D] px-4 py-3 font-medium text-white transition hover:bg-[#236626]"
            >
              <Camera size={20} />
              Take Photo
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium transition hover:bg-gray-50"
            >
              <ImageIcon size={20} />
              Gallery
            </button>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        )}

        {/* Identify Button */}
        {image && !result && (
          <button
            type="button"
            onClick={identifyHerb}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2B7A2D] px-4 py-3 font-semibold text-white transition hover:bg-[#236626] disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <Search size={20} />
            {loading ? "Identifying..." : "Identify Herb"}
          </button>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2B7A2D]" />
            <p className="font-medium">Analyzing your image...</p>
            <p className="mt-1 text-sm text-gray-500">This may take a few seconds.</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6">
            {!result.isPlant ? (
              <div className={`p-6 text-center ${cardClass}`}>
                <div className="mb-3 text-3xl">🌱</div>
                <h2 className="text-lg font-semibold">No plant detected</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Try taking a clearer photo with the herb centered in the image.
                </p>

                <button
                  type="button"
                  onClick={reset}
                  className="mt-5 rounded-xl bg-[#2B7A2D] px-5 py-2.5 font-medium text-white"
                >
                  Try Again
                </button>
              </div>
            ) : result.topMatch ? (
              <div className={`p-6 ${cardClass}`}>
                {/* Main identification */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-[#2B7A2D]">Possible Match</p>
                  <h2 className="mt-1 text-3xl font-bold">{result.topMatch.commonName || "Unknown Plant"}</h2>

                  {result.topMatch.scientificName && (
                    <p className="mt-1 text-sm italic text-gray-500">{result.topMatch.scientificName}</p>
                  )}

                  <p className="mt-3 text-sm text-gray-500">
                    Identification confidence:{" "}
                    <span className="font-semibold text-gray-900">
                      {formatProbability(result.topMatch.probability)}
                    </span>
                  </p>
                </div>

                {/* Confidence */}
                <div className={`mb-6 ${statBoxClass}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span>Confidence</span>
                    <span className="font-semibold">{formatProbability(result.topMatch.probability)}</span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-[#2B7A2D]"
                      style={{ width: `${Math.min(result.topMatch.probability * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Classification */}
                <div className="mb-6 grid grid-cols-2 gap-3">
                  <StatBox label="Genus" value={result.topMatch.genus || "Unknown"} />
                  <StatBox label="Family" value={result.topMatch.family || "Unknown"} />
                </div>

                {/* Herb Description */}
                {result.herbProfile?.description && (
                  <div className="mb-6">
                    <p className="mb-2 text-sm font-semibold">About</p>

                    <div className={statBoxClass}>
                      <p className="text-sm leading-6 text-gray-600">
                        {result.herbProfile.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Traditional Uses */}
                {result.herbProfile && 
                  result.herbProfile?.traditionalUses && 
                  result.herbProfile?.traditionalUses.length > 0 && (
                    <div className="mb-6">
                      <p className="mb-3 text-sm font-semibold">Traditional Uses</p>

                      <div className={statBoxClass}>
                        <ul className="space-y-2">
                          {result.herbProfile.traditionalUses.map((use, index) => (
                            <li
                              key={index}
                              className="flex gap-2 text-sm leading-6 text-gray-600"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2B7A2D]" />
                              <span>{use}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                }

                {/* Potential Benefits */}
                {result.herbProfile &&
                  result.herbProfile.potentialBenefits &&
                  result.herbProfile.potentialBenefits.length > 0 && (
                    <div className="mb-6">
                      <p className="mb-3 text-sm font-semibold">Potential Benefits</p>

                      <div className={statBoxClass}>
                        <ul className="space-y-2">
                          {result.herbProfile.potentialBenefits.map((benefit, index) => (
                            <li
                              key={index}
                              className="flex gap-2 text-sm leading-6 text-gray-600"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2B7A2D]" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                }
                
                {/* Safety Considerations */}
                {result.herbProfile &&
                  result.herbProfile.safetyConsiderations &&
                  result.herbProfile.safetyConsiderations.length > 0 && (
                    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="mb-3 text-sm font-semibold text-amber-900">
                        Safety Considerations
                      </p>

                      <ul className="space-y-2">
                        {result.herbProfile.safetyConsiderations.map(
                          (warning, index) => (
                            <li
                              key={index}
                              className="flex gap-2 text-sm leading-6 text-amber-800"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                              <span>{warning}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )
                }
                
                {/* Other possible matches */}
                {result.alternatives.length > 0 && (
                  <div>
                    <p className="mb-3 text-sm font-semibold">Other Possible Matches</p>

                    <div className="space-y-2">
                      {result.alternatives.map((plant) => (
                        <div
                          key={plant.gbifId ?? plant.scientificName}
                          className="rounded-lg border border-gray-100 px-4 py-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium">{plant.commonName || "Unknown Plant"}</p>
                              {plant.scientificName && (
                                <p className="mt-0.5 text-xs italic text-gray-400">{plant.scientificName}</p>
                              )}
                            </div>

                            <span className="shrink-0 text-sm font-medium text-gray-500">
                              {formatProbability(plant.probability)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reset */}
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-medium transition hover:bg-gray-50"
                >
                  <RotateCcw size={18} />
                  Identify Another
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-5">No identification was found.</div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}