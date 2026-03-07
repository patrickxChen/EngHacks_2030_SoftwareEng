# Waterloo Engineering Myth Buster - Design

## 1. Product Tone
- Memorable, playful, and relatable to Waterloo Engineering culture.
- Friendly but not sarcastic-toxic.
- Verdict copy should feel specific to building/program context.

## 2. Primary Screens
## Home (`/`)
- Hero with featured myth of the day.
- Quick links: Submit Myth, Explore Buildings, View Dashboard.
- Trending cards: "Most chaotic building this week", "Most busted myth".

## Submit (`/submit`)
- Form fields:
	- Myth text (required)
	- Building selector (required)
	- Program (optional)
	- Course code (optional)
	- Tone preference (funny/serious)
- Inline validation and examples.

## Myth Feed (`/myths`)
- Filter bar: building, program, course, verdict.
- `MythCard` with:
	- myth text
	- building badge
	- verdict badge
	- reasoning blurb
	- vote buttons
	- testimonial section

## Dashboard (`/dashboard`)
- Charts:
	- submissions by building
	- likely true ratio by building
	- testimonial volume by building
- Comparison mode: E7 vs E2 vs DC.

## Map (`/map`)
- Simple clickable UW engineering building map.
- Toggle metric:
	- submission count
	- true myth count
	- humor score
- Tooltip: top myth + quick stat for selected building.

## Admin (`/admin`)
- Open reports list.
- Action buttons: dismiss, remove, warn.

## 3. Component Design
- `BuildingBadge`: consistent building identity color.
- `VerdictBadge`: color + icon
	- true: warm amber
	- false: cool teal
	- mixed: neutral slate
- `VoteWidget`: up/down stateful buttons.
- `TestimonialList`: compact cards with timestamps.
- `StatsTile`: reusable metric summary card.

## 4. Visual System
## Typography
- Headings: `Space Grotesk`
- Body: `Source Sans 3`
- Monospace highlights (course codes): `IBM Plex Mono`

## Color tokens
- `--bg`: #f6f4ef
- `--surface`: #fffdf8
- `--ink`: #1d232a
- `--accent-amber`: #e49d37
- `--accent-teal`: #1e8a8a
- `--accent-brick`: #a4462f

## Motion
- Page entry fade+slide (200ms)
- Card stagger on feed load
- Subtle badge pulse when verdict appears

## 5. UX Rules
- Keep myth submission <= 4 taps on mobile.
- Always show building context near myth title.
- Make vote state clear after interaction.
- Distinguish AI verdict from community sentiment.

## 6. Accessibility
- WCAG AA contrast targets.
- Keyboard support for all controls.
- `aria-label` on icon-only buttons.
- Reduced-motion preference respected.

## 7. Empty/Error States
- Empty building filter: "No myths yet in this building. Be the first."
- API error: retry CTA and non-blocking toast.
- Moderated content: placeholder with reason.

## 8. Copy Examples
- Myth: "ECE labs in E7 always take 6 hours"
- Verdict: `Likely True`
- Reason: "Anyone who has wrestled with a microcontroller in E7 after midnight has lived this timeline."

