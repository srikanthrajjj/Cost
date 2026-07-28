import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  MapPin,
  HelpCircle,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  contactSchema,
  getContactClientErrorMessage,
  submitContactMessage,
} from "@/lib/email/submit-contact";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact CostReno | Support and feedback" },
      {
        name: "description",
        content:
          "Contact the CostReno team about estimates, quote analysis, feedback, or partnership questions.",
      },
      { property: "og:title", content: "Contact CostReno | Support and feedback" },
      {
        property: "og:description",
        content: "Reach the CostReno team for support, feedback, or partnership inquiries.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.costreno.com/contact" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.costreno.com/contact" }],
  }),
});

type FormState = "idle" | "submitting" | "success" | "error";

const SUBJECT_OPTIONS = [
  { value: "general", label: "General inquiry" },
  { value: "support", label: "Technical support" },
  { value: "estimate", label: "Question about an estimate" },
  { value: "quote", label: "Quote analyzer help" },
  { value: "feedback", label: "Feedback or suggestion" },
  { value: "partnership", label: "Partnership / business" },
] as const;

function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general" as (typeof SUBJECT_OPTIONS)[number]["value"],
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === "submitting") return;

    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message || "Please check the form and try again.");
      setFormState("error");
      return;
    }

    setFormState("submitting");
    setErrorMessage("");

    try {
      const result = await submitContactMessage({
        data: parsed.data,
      });

      if (result.success) {
        setFormState("success");
        setFormData({ name: "", email: "", subject: "general", message: "" });
        return;
      }

      setErrorMessage(result.message || "Something went wrong. Please try again.");
      setFormState("error");
    } catch (error) {
      setErrorMessage(getContactClientErrorMessage(error));
      setFormState("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formState === "error") {
      setFormState("idle");
      setErrorMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.03] via-transparent to-transparent" />
        <div className="container-x relative py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <Badge variant="secondary" className="mb-5 px-3 py-1 text-xs font-medium">
              Get in touch
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ink leading-[1.1] tracking-tight">
              Contact us
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Have a question, feedback, or need help with your estimate? We'd love to hear from
              you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-x py-12 md:py-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="border-border/60">
              <CardContent className="p-6 md:p-8">
                {formState === "success" ? (
                  <div className="text-center py-10" role="status" aria-live="polite">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-ink mb-2">Message sent</h3>
                    <p className="text-muted-foreground mb-6">
                      Thanks for reaching out. We'll get back to you within 24 to 48 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormState("idle")}
                      className="inline-flex items-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div>
                      <h2 className="font-display text-xl font-bold text-ink mb-1">
                        Send us a message
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Fill out the form below and we'll respond as soon as we can.
                      </p>
                    </div>

                    {formState === "error" && (
                      <div
                        className="flex items-center gap-2 rounded-lg bg-destructive/5 border border-destructive/20 px-4 py-3 text-sm text-destructive"
                        role="alert"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {errorMessage || "Something went wrong. Please try again."}
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-medium text-foreground mb-1.5"
                        >
                          Name <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          id="contact-name"
                          name="name"
                          required
                          autoComplete="name"
                          maxLength={120}
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          disabled={formState === "submitting"}
                          className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-medium text-foreground mb-1.5"
                        >
                          Email <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="email"
                          id="contact-email"
                          name="email"
                          required
                          autoComplete="email"
                          maxLength={254}
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          disabled={formState === "submitting"}
                          className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition disabled:opacity-60"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        Subject
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={formState === "submitting"}
                        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition disabled:opacity-60"
                      >
                        {SUBJECT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        Message <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={5}
                        minLength={10}
                        maxLength={5000}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        disabled={formState === "submitting"}
                        aria-describedby="contact-message-hint"
                        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition resize-none disabled:opacity-60"
                      />
                      <p id="contact-message-hint" className="mt-1.5 text-xs text-muted-foreground">
                        At least 10 characters.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={formState === "submitting"}
                      aria-busy={formState === "submitting"}
                      className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-sm hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                      {formState === "submitting" ? (
                        <>
                          <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Reach us</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the contact form and we'll reply to the email you provide.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Response time</h3>
                    <p className="text-sm text-muted-foreground">
                      We typically respond within 24 to 48 hours on business days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Location</h3>
                    <p className="text-sm text-muted-foreground">
                      Serving homeowners across the United States
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Topics */}
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-ink mb-3">Common topics</h3>
              <ul className="space-y-2.5">
                {[
                  { icon: HelpCircle, label: "How estimates are calculated" },
                  { icon: FileText, label: "Understanding quote analysis" },
                  { icon: MessageSquare, label: "Feature requests" },
                  { icon: AlertCircle, label: "Report an issue" },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <item.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
