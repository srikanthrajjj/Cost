import type { ContractorQuestion } from "@/types/knowledge";

export const roofingContractorQuestions: ContractorQuestion[] = [
  {
    question:
      "Are you licensed and insured in [STATE]? Can you provide a certificate of insurance?",
    category: "licensing",
  },
  {
    question: "What's your workmanship warranty, and is it in writing? How many years?",
    category: "warranty",
  },
  {
    question: "What manufacturer warranty comes with the materials, and how long is it?",
    category: "warranty",
  },
  {
    question: "Will you pull the required permits, or is that my responsibility?",
    category: "scope",
  },
  {
    question: "How many layers of existing roofing will you remove? Will you inspect the deck?",
    category: "scope",
  },
  {
    question:
      "What type of underlayment will you use? Do you install ice and water shield at the eaves?",
    category: "scope",
  },
  {
    question: "What type of flashing will you use at valleys, vents, and chimneys?",
    category: "scope",
  },
  {
    question: "How do you handle ventilation? Will you upgrade soffit/ridge vents?",
    category: "scope",
  },
  {
    question:
      "What happens if it starts raining during the job? How do you protect the exposed deck?",
    category: "process",
  },
  { question: "How long will the project take from start to finish?", category: "process" },
  {
    question: "How do you dispose of old roofing materials? Do you use a dumpster on-site?",
    category: "process",
  },
  {
    question:
      "Are gutters, flashing, and ventilation included in this price, or are they separate line items?",
    category: "scope",
  },
  {
    question:
      "What's your payment schedule? I've heard some contractors demand full payment upfront.",
    category: "payment",
  },
  {
    question: "Can you provide 3 local references from projects completed at least one year ago?",
    category: "protection",
  },
  {
    question:
      "Have you installed [specific material] before? Can you show me photos of past projects?",
    category: "protection",
  },
  {
    question: "What's included in cleanup? Will you do a magnet sweep for nails?",
    category: "process",
  },
  {
    question: "If you discover rot or damaged decking during the job, what's the process and cost?",
    category: "protection",
  },
  {
    question: "Do you use subcontractors, or is this your crew? If subs, are they also insured?",
    category: "licensing",
  },
];
