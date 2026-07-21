"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/email/subscribe";

interface NewsletterSignupProps {
  source?: string;
  compact?: boolean;
}

export function NewsletterSignup({ source = "general", compact = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const result = await subscribeToNewsletter({ data: { email, source } });
      setStatus(result.success ? "success" : "error");
      setMessage(result.message);
      if (result.success) setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-accent">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-bold hover:bg-accent/90 transition shadow-sm shadow-accent/20 shrink-0 disabled:opacity-50"
        >
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-bold hover:bg-accent/90 transition shadow-sm shadow-accent/20 shrink-0 disabled:opacity-50"
        >
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <div className="flex items-center gap-1.5 text-red-600">
          <AlertCircle className="h-3.5 w-3.5" />
          <span className="text-xs">{message}</span>
        </div>
      )}
    </form>
  );
}
