// src/components/AccordionItem.tsx
"use client"; // Necessário para usar hooks como useState

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type AccordionItemProps = {
  question: string;
  answer: React.ReactNode; // Permite passar texto, HTML, ou outros componentes como resposta
};

export default function AccordionItem({ question, answer }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md p-2"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-gray-800">{question}</span>
        <ChevronDown
          className={`h-6 w-6 text-gray-500 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen mt-4" : "max-h-0"
        }`}
      >
        <div className="p-2 text-gray-600">{answer}</div>
      </div>
    </div>
  );
}