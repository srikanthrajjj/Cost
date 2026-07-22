import { pgTable, text, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";

/** Uploaded contractor quotes + analysis summaries */
export const quoteUploads = pgTable("quote_uploads", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  fileName: text("file_name"),
  fileType: text("file_type"),
  fileSize: integer("file_size"),
  rawText: text("raw_text").notNull(),
  projectType: text("project_type"),
  contractor: text("contractor"),
  totalPrice: real("total_price"),
  completenessScore: real("completeness_score"),
  lineItemCount: integer("line_item_count"),
  missingCount: integer("missing_count"),
  clarificationCount: integer("clarification_count"),
  redFlagCount: integer("red_flag_count"),
  analysisSummary: jsonb("analysis_summary"),
  source: text("source").default("quote-analyzer"),
});

/** Homeowner feedback on quote analysis quality */
export const quoteFeedback = pgTable("quote_feedback", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  quoteUploadId: text("quote_upload_id"),
  accuracy: text("accuracy"),
  understandable: text("understandable"),
  useAgain: text("use_again"),
  comment: text("comment"),
  projectType: text("project_type"),
  contractor: text("contractor"),
  completenessScore: real("completeness_score"),
});

/** Shareable multi-quote comparison snapshots (unlisted links) */
export const comparisonReports = pgTable("comparison_reports", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  snapshot: jsonb("snapshot").notNull(),
  quoteCount: integer("quote_count").notNull(),
  projectType: text("project_type"),
  recommendedContractor: text("recommended_contractor"),
  source: text("source").default("quote-comparison"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

export type QuoteUploadRow = typeof quoteUploads.$inferSelect;
export type QuoteFeedbackRow = typeof quoteFeedback.$inferSelect;
export type ComparisonReportRow = typeof comparisonReports.$inferSelect;
