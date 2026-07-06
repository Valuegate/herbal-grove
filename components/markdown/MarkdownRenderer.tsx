"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({
  content,
}: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mt-6 mb-4">
            {children}
          </h1>
        ),

        h2: ({ children }) => (
          <h2 className="text-xl font-bold mt-5 mb-3">
            {children}
          </h2>
        ),

        h3: ({ children }) => (
          <h3 className="text-lg font-semibold mt-4 mb-2">
            {children}
          </h3>
        ),

        p: ({ children }) => (
          <p className="leading-7 mb-3 whitespace-pre-wrap">
            {children}
          </p>
        ),

        ul: ({ children }) => (
          <ul className="list-disc ml-6 mb-4 space-y-2">
            {children}
          </ul>
        ),

        ol: ({ children }) => (
          <ol className="list-decimal ml-6 mb-4 space-y-2">
            {children}
          </ol>
        ),

        li: ({ children }) => (
          <li className="leading-7">
            {children}
          </li>
        ),

        blockquote: ({ children }) => (
          <blockquote className="my-4 border-l-4 border-green-500 pl-4 italic opacity-90">
            {children}
          </blockquote>
        ),

        hr: () => (
          <hr className="my-6 border-neutral-600" />
        ),

        table: ({ children }) => (
          <div className="my-4 overflow-x-auto rounded-xl border border-neutral-600">
            <table className="min-w-full border-collapse">
              {children}
            </table>
          </div>
        ),

        thead: ({ children }) => (
          <thead className="bg-neutral-700">
            {children}
          </thead>
        ),

        th: ({ children }) => (
          <th className="border border-neutral-600 px-4 py-3 text-left font-semibold whitespace-nowrap">
            {children}
          </th>
        ),

        td: ({ children }) => (
          <td className="border border-neutral-600 px-4 py-3 align-top">
            {children}
          </td>
        ),

        pre: ({ children }) => (
          <pre className="my-4 overflow-x-auto rounded-xl bg-black p-4 text-sm">
            {children}
          </pre>
        ),

        code: ({ className, children }) => {
          const isCodeBlock = className?.includes("language-");

          if (isCodeBlock) {
            return <code className={className}>{children}</code>;
          }

          return (
            <code className="rounded bg-neutral-700 px-1.5 py-1 text-sm text-green-300">
              {children}
            </code>
          );
        },

        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 underline hover:text-green-300"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}