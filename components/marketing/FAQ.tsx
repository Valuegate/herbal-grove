import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * FAQ — frequently asked questions using shadcn Accordion.
 * Single collapsible with the last item open by default.
 */

function LeafIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4C21 6 25 10 25 15C25 20 21 24 16 24L16 4Z" fill="#1a7a1e" />
      <path d="M16 6C11 6 7 10 7 15C7 20 11 24 16 24L16 6Z" fill="#1a7a1e" opacity="0.4" />
      <path d="M16 8L16 26" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 14C16 14 13 11 10 12" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M16 18C16 18 19 15 22 16" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const faqs = [
  {
    id: "item-1",
    question: "Is HerbaGrove a medical or diagnostic tool?",
    answer:
      "No. HerbaGrove is an educational platform designed to support informed learning about herbs. It is not a substitute for medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before starting any herbal regimen.",
  },
  {
    id: "item-2",
    question: "How accurate is herb identification?",
    answer:
      "Our AI achieves 94% identification accuracy across 500+ herb species. We always recommend verifying with our community of practitioners for rare or unusual herbs.",
  },
  {
    id: "item-3",
    question: "Who reviews the information provided?",
    answer:
      "All herb guides are reviewed and verified by certified herbalists, naturopaths, and traditional medicine practitioners before being published.",
  },
  {
    id: "item-4",
    question: "Can I talk to a real herbal consultant?",
    answer:
      "Yes. When available, you can ask questions and receive guidance from a verified herbal consultant for additional clarity.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-white section-padding py-24">
      <div className="content-width flex flex-col items-center gap-16">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <LeafIcon />
            <span className="text-brand-primary font-semibold text-xl">
              FREQUENTLY ASKED QUESTION
            </span>
          </div>
          <h2 className="font-heading font-medium text-3xl md:text-[40px] leading-tight md:leading-[60px]">
            Questions about using{" "}
            <span className="text-brand-primary">HerbaGrove</span>
          </h2>
          <p className="text-lg md:text-xl text-body-text max-w-[514px]">
            Find answers to common questions about how HerbaGrove works and
            what you can expect.
          </p>
        </div>

        {/* Accordion */}
        <Accordion
          type="single"
          collapsible
          defaultValue="item-4"
          className="w-full max-w-[1120px] flex flex-col gap-4"
        >
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-white rounded-xl shadow-[0_0_4px_0_rgba(0,0,0,0.25)] px-6 md:px-8 py-2 border-none"
            >
              <AccordionTrigger className="font-bold text-lg md:text-2xl text-neutral-800 hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-neutral-800 pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
