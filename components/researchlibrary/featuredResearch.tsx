"use client"

import Image from "next/image";
import Image1 from "@/components/researchlibrary/mint.jpg";
import Image2 from "@/components/researchlibrary/ginseng.jpg"
import Image3 from "@/components/researchlibrary/tumeric.jpg"
import Image4 from "@/components/researchlibrary/withnae.jpg"
import Image5 from "@/components/researchlibrary/chamomile.jpg"
import Image6 from "@/components/researchlibrary/ginger.jpg"
import { useDashboardContext } from "@/components/dashboard/DashboardContext";

interface ResearchArticlesProps {
  searchQuery: string
}

const articles = [
  {
    id: 0,
    photo: Image1,
    tags: ["Adaptogen", "Anxiety"],
    readTime: "8 min read",
    title: "The Efficacy of Mentha Piperita in Managing IBS Symptoms",
    description:
      "Summarizing double-blind placebo-controlled trials regarding enteric-coated peppermint oil and gastrointestinal health.",
  },
  {
    id: 1,
    photo: Image2,
    tags: ["Digestive", "Inflammation"],
    readTime: "15 min read",
    title: "Echinacea Purpurea: A Clinical Review on Immune Modulation",
    description:
      "An in-depth look at the chemical compounds and therapeutic mechanisms of Echinacea in preventing respiratory infections...",
  },
  {
    id: 2,
    photo: Image3,
    tags: ["Anti-inflammatory", "Joint Health"],
    readTime: "12 min read",
    title: "Curcuma Longa Extract for Arthritis Relief",
    description:
      "Clinical evidence on turmeric's curcuminoids and their effect on pain, swelling, and mobility in osteoarthritis patients.",
  },
  {
    id: 3,
    photo: Image4,
    tags: ["Adaptogen", "Stress"],
    readTime: "10 min read",
    title: "Withania Somnifera: Stress Resilience and Cognitive Support",
    description:
      "A review of Ashwagandha supplementation studies measuring cortisol, anxiety, and memory performance in adults.",
  },
  {
    id: 4,
    photo: Image5,
    tags: ["Sleep", "Relaxation"],
    readTime: "9 min read",
    title: "Matricaria Chamomilla and Its Role in Sleep Quality",
    description:
      "Analyzing randomized trials on chamomile tea intake and its impact on insomnia symptoms and sleep architecture.",
  },
  {
    id: 5,
    photo: Image6,
    tags: ["Digestive", "Metabolism"],
    readTime: "14 min read",
    title: "Zingiber Officinale for Nausea and Gut Motility",
    description:
      "Examining ginger's efficacy in nausea relief, gastric emptying, and inflammatory markers in digestive disorders.",
  },
];

export default function FeaturedResearch ({ searchQuery }: ResearchArticlesProps) {
  const { darkMode } = useDashboardContext();

  //Search Functionality
  const researchFilter = articles.filter(research => 
    research.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  if (researchFilter.length === 0) {
    return (
      <div className={`
        flex flex-col items-center justify-center text-center py-12 px-6
        ${darkMode ? 'bg-[#222224] border-neutral-800/80'
          : 'bg-white border-gray-200/80'
        }  
      `}>
        <div className="space-y-1 max-w-xs">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#222224]'}`}>
            No Saved Posts Found
          </h3>
          <p className={`text-sm ${darkMode ? 'text-white' : 'text-[#222224]'}`}>
            We could not find any saved posts matching "{searchQuery}". Try something else.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="space-y-6 py-6">
        <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-medium ${darkMode ? "text-white" : 'text-black'}`}>
          Featured Research
        </h2>

        <button type="button" className={`text-sm font-bold cursor-pointer ${darkMode ? "text-white" : 'text-black'}`}>
          View All Papers
        </button>
      </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        {researchFilter.map((article) => (
          <div key={article.id} className={`overflow-hidden rounded-xl border ${darkMode ? "border-gray-700 bg-[#222224]" : 'border-gray-200 bg-white shadow-sm'}`}>
            {/*Study Head*/}
            <div className="relative h-36 overflow-hidden sm:h-44">
              <Image
                src={article.photo}
                alt={article.title}
                className="h-full w-full object-cover"
              />

              <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1.5 text-[10px] font-bold uppercase text-white">
                Recent Study
              </span>
            </div>

            {/*Study Body*/}
            <div className="space-y-4 p-5">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase ${darkMode ? "bg-[#222224] text-white" : 'bg-slate-500 text-gray-700'}`}>
                    {tag}
                  </span>
                ))}
              </div>
              
              <div>
                <h3 className={`text-xl font-extrabold leading-tight ${darkMode ? "text-white" : 'text-[#222224]'}`}>
                  {article.title}
                </h3>

                <p className={`mt-2 text-sm ${darkMode ? "text-white" : 'text-[#222224]'}`}>
                  {article.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className={`text-sm font-bold ${darkMode ? "text-white" : 'text-[#222224]'}`}>
                  {article.readTime}
                </span>

                <button type="button" className={`text-sm  font-bold cursor-pointer ${darkMode ? "text-white" : 'text-[#222224]'}`}>
                  Read Analysis
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  )
}