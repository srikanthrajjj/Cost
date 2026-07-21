# CostReno - Agent Guidelines

## Project Philosophy

CostReno helps homeowners make informed renovation decisions through AI-powered cost estimates and contractor quote analysis.

Every feature should prioritize:

1. Trust
2. Accuracy
3. Simplicity
4. Performance
5. Accessibility
6. Visual polish

Never sacrifice accuracy, usability, SEO, or performance for visual effects.

---

## Design Principles

The website should feel:

- Modern
- Premium
- Clean
- Professional
- Trustworthy
- Spacious
- Data-driven

Avoid:

- Flashy designs
- Heavy gradients
- Glassmorphism
- Overly colorful interfaces
- Excessive animations
- Marketing hype
- Dark patterns

Every page should answer within the first viewport:

1. What is this?
2. Why should I trust it?
3. What should I do next?

---

# Brand Guidelines

## Colors

### Primary Color

- **Hex:** #082A4B (Dark Navy Blue)
- **Usage:** Headers, navigation, primary text, icons, borders, cards, general UI elements
- **Tailwind:** `bg-primary`, `text-primary`

### Secondary / Accent Color

- **Hex:** #03A44D (Green)
- **Usage:** Primary CTAs, success states, progress indicators
- **Tailwind:** `bg-accent`, `text-accent-foreground`

### IMPORTANT

Use green **sparingly**.

Green should only appear for:

- "Start Planning"
- "Calculate My Estimate"
- "Subscribe Free"
- Success messages
- Positive status indicators

Never use green for:

- Navigation
- Paragraph text
- Links
- Secondary buttons
- Large backgrounds
- Decorative elements

### Color Rules

1. Dark blue is the default UI color.
2. Green is reserved for primary actions.
3. Prefer white backgrounds with subtle gray surfaces.
4. Maintain consistent contrast and accessibility.

---

## Typography

Display Font

- Plus Jakarta Sans

Body Font

- Inter

Guidelines

- Large readable headings
- Comfortable line height
- Clear visual hierarchy
- Avoid overly bold interfaces

---

# UI Guidelines

Create interfaces that feel similar to:

- Stripe
- Linear
- Vercel
- Notion

Characteristics

- Large whitespace
- Rounded corners
- Soft shadows
- Minimal borders
- Clear hierarchy
- Premium layouts
- Consistent spacing

Prefer:

- Cards
- Icons
- Clean illustrations
- Progressive disclosure

Avoid:

- Clutter
- Dense layouts
- Excessive borders
- Too many colors

---

# Components

Always prefer high-quality open-source components before building custom ones.

Priority:

1. shadcn/ui
2. Magic UI
3. Origin UI
4. Motion Primitives
5. React Bits

Rules:

- Reuse existing components whenever possible.
- Do not recreate components that already exist.
- Adapt components to match the CostReno design system.
- Avoid unnecessary dependencies.

---

# Animations & Micro-interactions

The website should feel alive through subtle interactions without affecting SEO or performance.

Guidelines:

- Use lightweight hover effects.
- Prefer CSS transitions.
- Animate only `transform` and `opacity`.
- Avoid animating layout properties.
- Respect `prefers-reduced-motion`.
- Keep animations between 150–250ms.
- Use smooth easing.
- Never reduce Core Web Vitals for animations.

Recommended interactions:

- Button hover scale
- Card lift
- Icon transitions
- Smooth input focus
- Image hover zoom (when appropriate)
- Gentle fade-ins for sections

Animations should enhance the experience, not distract from it.

---

# SEO Guidelines

Always build pages with SEO in mind.

- Every page must have a unique title.
- Every page must have a meta description.
- Only one H1 per page.
- Maintain proper heading hierarchy.
- Use semantic HTML.
- Write descriptive alt text.
- Prefer descriptive URLs.
- Add internal links where appropriate.
- Use Schema.org structured data whenever applicable.
- Optimize images.
- Prioritize Core Web Vitals.
- Avoid unnecessary client-side rendering for important content.

---

# Content Guidelines

Write for homeowners.

Tone:

- Professional
- Friendly
- Clear
- Honest
- Helpful

Avoid:

- Marketing buzzwords
- Clickbait
- Exaggerated claims
- Technical jargon where possible

Do NOT use:

- Em dashes (—)
- En dashes (–)

Instead use:

- commas
- periods
- parentheses
- bullet lists

Use US English.

Prefer active voice.

Never claim:

- "Best"
- "Most accurate"
- "Guaranteed savings"

unless supported with evidence.

---

# Accessibility

Meet WCAG AA standards.

Requirements:

- Keyboard accessible
- Proper labels
- Visible focus states
- Accessible color contrast
- Semantic HTML
- ARIA only when necessary

Never rely only on color to communicate meaning.

---

# Performance

Performance is a product feature.

Prioritize:

- Fast page loads
- Small bundles
- Optimized images
- Lazy loading
- Server rendering where appropriate
- Minimal JavaScript

Avoid unnecessary dependencies.

---

# Images & Graphics

Prefer:

- SVG illustrations
- Blueprint-inspired graphics
- Modern home visuals
- Clean product mockups
- Professional 3D illustrations

Avoid:

- Generic stock photos
- Cartoon artwork
- Low-quality AI imagery

---

# Code Guidelines

Framework:

- TanStack Start
- React

Styling:

- Tailwind CSS v4

UI:

- shadcn/ui

Rules:

- TypeScript only
- Strong typing
- Functional components
- Reuse existing components
- No duplicate logic
- Keep components focused
- Remove unused imports
- No commented-out code
- Use meaningful names

---

# AI Guidelines

Never fabricate:

- Pricing
- Renovation data
- Material identification

Clearly distinguish between:

- User input
- AI inference
- Deterministic calculations

If uncertain:

- Ask the user
- Display confidence
- Never guess

---

# Responsive Design

Every page must work across:

- Mobile
- Tablet
- Laptop
- Desktop

Avoid horizontal scrolling.

Maintain consistent spacing across breakpoints.

---

# General Rules

Before building anything:

1. Search for an existing component.
2. Reuse before creating.
3. Keep solutions simple.
4. Optimize for readability.
5. Maintain visual consistency.
6. Prioritize trust over decoration.
7. Prioritize performance over animations.
8. Build interfaces homeowners can understand in seconds.


## Typography & Text Formatting

### Sentence case only (Mandatory)

Use **sentence case** for all UI text. Do **not** use Title Case or Capitalize Every Word.

### Rules

- Capitalize only the first word of a heading or sentence.
- Capitalize proper nouns, company names, brands, locations, abbreviations, and acronyms (e.g., AI, PDF, HVAC, API, CostReno).
- Keep the rest of the words lowercase unless grammar requires otherwise.
- Apply this consistently across:
  - Page titles
  - Section headings
  - Card titles
  - Feature titles
  - Buttons
  - Navigation
  - Forms
  - Labels
  - Dialogs
  - Notifications
  - Tooltips
  - Empty states
  - Error messages
  - Marketing content

### Examples

✅ Correct
- AI-powered quote analysis
- Detect red flags before they cost you
- Save more. Spend smarter.
- Contractor quotes are hard to understand
- Compare prices with market rates
- Clear reports. Confident decisions.
- Upload your contractor quote
- Analyze my quote
- View full report

❌ Incorrect
- AI Powered Quote Analysis
- Detect Red Flags Before They Cost You
- Save More. Spend Smarter.
- Contractor Quotes Are Hard To Understand
- Compare Prices With Market Rates
- Clear Reports. Confident Decisions.

### Content writing guidelines

- Write naturally and conversationally.
- Keep headings concise (3–7 words when possible).
- Avoid unnecessary capitalization for emphasis.
- Prefer simple, human-readable language over marketing jargon.
- Maintain consistent capitalization across the entire application.

**This rule is mandatory and takes precedence over default title-casing behavior.**