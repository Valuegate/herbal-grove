"use client";

interface Props {
  content: string;
}

export default function PaperContent({
  content,
}: Props) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .filter(
      (paragraph) => paragraph.trim().length > 0
    );

  return (
    <article className="prose prose-lg max-w-none">
      {paragraphs.map(
        (paragraph, index) => (
          <p
            key={index}
            className="mb-6 leading-8 text-gray-700"
          >
            {paragraph}
          </p>
        )
      )}
    </article>
  );
}