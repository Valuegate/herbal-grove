"use client"

import Image from "next/image"
import Link from "next/link"
import { BookmarkIcon } from "@/components/ui/icons"
import { FlowerIcon } from "@/components/ui/icons"
import FlowerImage from "@/components/dashboard/morter.png"

export const herbs = [
  {
    name: "Holy Basil (Tulsi)",
    details: "Known as the \"Queen of Herbs,\" Holy Basil is a powerful adaptogen that helps the body cope with stress and promotes mental clarity.",
    image: FlowerImage
  },
  {
    name: "Chamomile",
    details: "Valued for its calming and soothing properties, Chamomile is widely used to promote restful sleep, support healthy digestion, and ease tension.",
    image: "Chamomile Illustration"
  },
  {
    name: "Ashwagandha",
    details: "A foundational herb in Ayurveda, Ashwagandha is celebrated for its ability to enhance vitality, support thyroid health, and build stamina.",
    image: "Ashwagandha Illustration"
  }
]

interface HerbCardProps {
  darkMode: boolean,
  herbIndex?: number
}

export default function HerbOfTheDay({ darkMode, herbIndex = 0 }: HerbCardProps) {
  //Access one of the herbs in the array
  const activeHerb = herbs[herbIndex] || herbs[0];

  return (
    <section className="relative">
      <div className={`
        rounded-3xl p-6 md:p-7 pt-20 md:pt-20 flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-between border relative overflow-hidden transition-all duration-300 
        ${darkMode
        ? 'bg-[#1e1e1e] border-neutral-800 shadow-[0_8px_30px_rgba(0,0,0,0.4)] '
          : 'bg-white border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.4)] shadow-black-500/10'
        }
      `}>
        {/*Herb Details*/}
        <div className="absolute top-2 left-0 right-0  flex justify-center z-20">
          <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full text-base font-bold text-[#001900] bg-[#c9ffc9] dark:bg-[#c9ffc9] dark:text-[#001900]">
            <FlowerIcon />
            <span>Herb of the Day</span>
          </div>
        </div>

        <div className="flex-1 space-y-4 w-full relative z-10">
          {/*Title*/}
          <h3 className={`text-2xl md:text-3xl font-extrabold tracking-normal ${darkMode ? 'text-white' : 'text-[#031609]'}`}>
            {activeHerb.name}
          </h3>

          {/*Description*/}
          <p className={`text-sm md:text-base leading-relaxed max-w-xl ${darkMode ? 'text-neutral-300' : 'text-gray-600'}`}>
            {activeHerb.details}
          </p>

          {/*Actions*/}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="#" className={`flex items-center text-sm font-bold group transition duration-150 hover:underline ${darkMode ? 'text-[#c9ffc9]' : 'text-[#001900]'}`}>
                <span>Read Research</span>
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </Link>

            <Link href="#" className={`flex items-center text-sm font-bold px-4 py-2 rounded-full border transition duration-150 ${
                darkMode 
                  ? 'border-neutral-700 hover:bg-neutral-800 text-neutral-300' 
                  : 'border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}>
                <BookmarkIcon />
                <span>Save</span>
            </Link>
          </div>
        </div>

        {/*Herb Image*/}
        <div className="w-full md:w-60 lg:w-64 shrink-0 flex justify-center z-10">
          <div className={`
            w-56 h-56 md:w-60 md:h-60 lg:w-64 lg:h-64 
            flex flex-col items-center justify-center p-6 text-center select-none transition-all duration-300 relative group overflow-hidden
            ${darkMode 
              ? 'bg-[#222224]' 
              : 'bg-[#181818]'
            }
          `}>
            <div className="w-full md:w-60 lg:w-64 shrink-0 flex justify-center z-10">
              {typeof activeHerb.image === "string" ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <FlowerIcon />
                    <span className="text-sm text-gray-500">Image unavailable</span>
                  </div>
                </div>
              ) : (
                <Image
                  src={activeHerb.image}
                  width={200}
                  height={200}
                  alt={activeHerb.name}
                />
              )}
              </div>
          </div>
        </div>
      </div>
    </section>
  )
}
