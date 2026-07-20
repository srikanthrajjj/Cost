"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";

interface EmailDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  reportName?: string;
  isLoading?: boolean;
}

export function EmailDownloadModal({
  isOpen,
  onClose,
  onSubmit,
  reportName = "Report",
  isLoading = false,
}: EmailDownloadModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await onSubmit(email);
      setSubmitted(true);
      // Reset after 2 seconds and close
      setTimeout(() => {
        setEmail("");
        setError("");
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process download. Please try again.",
      );
    }
  };

  const handleClose = () => {
    if (!isLoading && !submitted) {
      setEmail("");
      setError("");
      setSubmitted(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-accent" />
                Get Your {reportName}
              </DialogTitle>
              <DialogDescription>
                Enter your email to download the report. We'll also send you home renovation tips
                and trends to keep you updated.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-ink">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(""); // Clear error when user starts typing
                  }}
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground">
                Your email is secure and only used to send home renovation tips, trends, and
                exclusive insights. We respect your privacy.
              </p>

              <DialogFooter className="gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>Download</>
                  )}
                </button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-accent">
                <CheckCircle2 className="h-5 w-5" />
                Success!
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 text-center space-y-2">
              <p className="text-sm text-ink font-medium">Your {reportName} is downloading</p>
              <p className="text-xs text-muted-foreground">
                Check your downloads folder. You'll also receive home renovation tips at {email}.
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
