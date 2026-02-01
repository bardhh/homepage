## 2026-01-31 - Missing Skip-to-Content Link
**Learning:** The "Skip to content" link is a critical accessibility feature. Its absence forces keyboard users to navigate through repetitive navigation headers (like large social/nav bars) on every page load.
**Action:** Always check `layout.tsx` (or equivalent root component) first for a skip link. If missing, adding one is a high-impact, low-effort win that immediately benefits keyboard and screen reader users. Ensure the target (e.g., `<main>`) has `id` and `tabIndex={-1}` for proper focus management.

## 2026-02-01 - Focus Management on Conditional Elements
**Learning:** When an interactive element (like a "Clear Search" button) is removed from the DOM upon activation, the user's focus is lost (reverting to `body`). This disrupts the keyboard navigation flow.
**Action:** Always programmatically move focus to a logical subsequent or parent element (e.g., the input field) before or immediately after the triggering element disappears. Use `useRef` to target the destination.
