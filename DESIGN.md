# Sola Design System

## Visual world

Sola uses a light DeFi-terminal direction: a calm, almost-white canvas, precise hairline borders, restrained density, and one vivid green signal reserved for meaningful action and system health. Trust comes from legibility, source visibility, and controlled hierarchy rather than decoration.

The interface must read as a working financial product first. The visual world contributes type, palette, density, and one signature move; navigation and controls remain familiar web controls.

## Product expression

The dashboard is organized around the user's core loop: connect, understand, prepare, verify, sign, follow. Real balances and transaction states lead the page. The signature move is a persistent freshness rail: every on-chain value carries a compact, visible state of freshness (à jour, en cours, erreur), with green reserved for healthy/live data and primary actions.

## Tokens

### Color

```css
--canvas: #ffffff;
--surface: #f6f6f4;
--border: #e4e4e1;
--ink: #0a0a0a;
--muted: #6e6e6e;
--signal: #3fe280;
--signal-ink: #1b8f52;
--danger: #d64545;
--warning: #c98a1f;
```

The signal green is never used as decorative background or ordinary body text. It is used for primary actions, live-data borders and healthy synchronization. Red is reserved for blocking errors; amber is reserved for warnings and expiring quotes.

### Typography

- Inter for all functional interface text.
- A display face may be used only on the pre-connection welcome surface.
- Use two weights: 400 for body text and 500 for labels, amounts and actions.
- Use a compact, highly legible scale optimized for narrow mobile screens.
- Use tabular numerals for financial values and transaction amounts.

### Shape and spacing

- 8px spacing base.
- 12px card radius.
- 16px button radius.
- Minimum 44px interactive target height.
- No gradients and no drop shadows.
- Depth comes from the canvas/surface/border contrast.

## Navigation

On mobile, use a bottom navigation with Dashboard, Activity, Chat and Profile. Sensitive actions (Receive, Send, Swap) are reached from the dashboard and are not normalized as primary navigation destinations. On wider screens, the same information architecture may become a compact side rail.

## Component character

- Balance cards: quiet surface, thin border, live-data signal edge, clear masking control.
- Transaction rows: compact, scannable, with a consistent icon system and explicit status.
- Network banner: visible on Receive and Send, never hidden in a tooltip.
- Draft operation card: structured summary with a clear “Vérifier et continuer” action.
- Quote card: rate, estimated amount, network fee and Sola fee on separate lines, with expiry state.
- Verification surface: one reusable, interruption-protected component for Send and Swap.
- Sync indicator: the same vocabulary and placement across all data surfaces.

## States

Every data surface supports loading, background synchronization, error with retry, empty state, success/confirmed, and expired quote. No stale or simulated financial data is presented as current.

## Accessibility and responsive behavior

Mobile-first. Respect safe areas, keyboard focus, readable contrast, touch targets, reduced motion, and explicit error recovery. Never use swipe-to-confirm for irreversible actions.

## Do not introduce

No decorative gradients, glassmorphism, soft floating cards, emoji icons, fake charts, invented financial values, excessive color, or UI that resembles a seed-phrase input. The interface must remain calm, explicit and verifiable.
