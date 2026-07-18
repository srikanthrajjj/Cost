# Download Report Feature - User Guide

## Feature Overview

The download report functionality now captures user emails before generating and downloading reports. This allows CostReno to:
1. Build an email list for home renovation tips and trends
2. Track user engagement
3. Provide better customer follow-up

## User Interface

### Modal Dialog
When users click any download button, they see a professional modal with:

```
┌─────────────────────────────────────────┐
│  📧 Get Your [Report Type]              │
│─────────────────────────────────────────│
│  Enter your email to download the       │
│  report. We'll also send you home       │
│  renovation tips and trends to keep     │
│  you updated.                           │
│                                         │
│  Email Address                          │
│  [___________________________]           │
│                                         │
│  Your email is secure and only used    │
│  to send home renovation tips, trends, │
│  and exclusive insights. We respect    │
│  your privacy.                          │
│                                         │
│  [Cancel]              [Download ▼]    │
└─────────────────────────────────────────┘
```

### Success State (After Submission)
```
┌─────────────────────────────────────────┐
│  ✓ Success!                             │
│─────────────────────────────────────────│
│                                         │
│  Your [Report Type] is downloading      │
│                                         │
│  Check your downloads folder. You'll   │
│  also receive home renovation tips at  │
│  user@example.com.                      │
│                                         │
└─────────────────────────────────────────┘
```

## Implementation Details

### Color Scheme (Brand Compliant)
- **Primary Colors:**
  - Dark Navy (#082A4B) for headers and text
  - Green (#03A44D) for accent and primary button
  - White for backgrounds
  - Gray (#6B7280) for secondary text

- **Interactive States:**
  - Button hover: `hover:bg-accent/90` (slightly darker green)
  - Focus states: Green ring outline for accessibility
  - Disabled: Opacity 50% with `cursor-not-allowed`
  - Error: Red background (#FEE2E2) with red borders

### Typography
- Headers: Bold, larger size
- Labels: Medium weight
- Body text: Regular weight
- Privacy notice: Smaller, muted color

### Form Validation
- Email format validation using regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Real-time error clearing on input
- Helpful error messages:
  - "Please enter your email address"
  - "Please enter a valid email address"
  - Custom backend errors when applicable

### Loading States
- Download button shows spinner during processing
- Button text changes to "Downloading..."
- Inputs are disabled while downloading
- Cancel button is disabled during download
- Prevents multiple submissions

## Pages with Download Feature

### 1. Estimate Page (`/estimate`)
**Locations:**
- "Download PDF Report" in Next Steps section
- Report Type: Estimate Report
- Data Included: Project type, estimated cost, confidence score

**Flow:**
1. User completes estimate wizard
2. User sees "Download PDF Report" button in recommended next steps
3. Clicks button → Email modal opens
4. Enters email → Report downloads

### 2. Quote Analyzer Page (`/quote-analyzer`)
**Locations:**
- "Download Report" button in header (top right)
- "Download Full Report" button in verdict section (bottom)
- Report Type: Quote Analysis Report
- Data Included: Health score, missing items, red flags, contractor info

**Flow:**
1. User uploads quote PDF
2. AI analyzes the quote
3. User sees analysis results with download buttons
4. Clicks either button → Email modal opens
5. Enters email → Report downloads

## What Gets Downloaded

### For Estimates
```html
<CostReno Estimate Report>
Generated: [date/time]
Project Type: [e.g., Roof Replacement]
Estimated Cost: $[amount]
Confidence Score: [%]
```

### For Quote Analysis
```html
<CostReno Quote Analysis Report>
Generated: [date/time]
Quote Health Score: [/100]
Missing Items: [count]
Items Needing Clarification: [count]
Red Flags: [count]
Contractor: [name]
Total Quote Amount: $[amount]
```

## User Privacy

The modal includes clear messaging about email usage:
- "Your email is secure and only used to send home renovation tips, trends, and exclusive insights."
- "We respect your privacy."

Current implementation:
- ✅ Emails validated on client-side
- ✅ No sensitive data stored locally
- ✅ Explicit user consent before download
- ⚠️ Backend email storage not yet implemented

## Backend Integration (Optional)

To enable automatic email sending, uncomment this section in `src/lib/download-utils.ts`:

```typescript
// Step 2: In production, send email to backend
if (typeof window !== "undefined") {
  await fetch("/api/email/send-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, reportType, filename }),
  });
}
```

Then create an API endpoint to:
1. Validate the email
2. Generate/send the report
3. Store email for newsletter (with proper consent)
4. Apply rate limiting

## Accessibility Features

✅ **Implemented:**
- Proper form labels (`<label htmlFor="email">`)
- ARIA-friendly Dialog component
- Keyboard navigation support
- Focus ring indicators (green accent)
- Screen reader friendly error messages
- Clear button states and disabled states

## Mobile Responsiveness

The modal is responsive and works well on:
- Desktop (full width)
- Tablet (adjusted padding)
- Mobile (full screen with padding)

The max-width is set to medium (`max-w-md`) to maintain readability on larger screens while being fully responsive on smaller devices.

## Testing Checklist

- [ ] Click download button on estimate page → modal appears
- [ ] Click download button on quote analyzer page → modal appears
- [ ] Enter valid email → Download button enables
- [ ] Enter invalid email → Error message appears
- [ ] Clear email field → Error clears automatically
- [ ] Submit with empty field → Shows "Please enter email" error
- [ ] Submit with invalid email → Shows "Please enter valid email" error
- [ ] Submit with valid email → Loading spinner shows
- [ ] File downloads to local machine
- [ ] Success message appears for 2 seconds
- [ ] Modal closes automatically after success
- [ ] Can start new download without refreshing page

## Future Enhancements

1. **Email Confirmation Sent Message**
   - Show when report is actually emailed
   - Include timestamp in success message

2. **Newsletter Signup Option**
   - Optional checkbox: "Subscribe to home renovation tips"
   - Default unchecked for privacy compliance

3. **Report History**
   - Store downloads for authenticated users
   - Allow re-download without entering email again

4. **PDF Export**
   - Currently HTML reports
   - Consider upgrade to PDF for better formatting

5. **Report Customization**
   - Let users choose what sections to include
   - Select export format (PDF, HTML, etc.)

6. **Analytics**
   - Track download metrics
   - Monitor email capture rates
   - A/B test different messaging
