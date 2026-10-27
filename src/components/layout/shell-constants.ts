// Page canvas (the grey around the header card and the main card).
// HEADER-GAP COLOUR FIX (2026-10-27, user decision: "keep the header
// separate as a card, only fix the gap colour" — the rejected flush
// fix is NOT re-applied, and no padding/margin/radius changes here):
// CANVAS used to be #dee1e6 (222,225,230), which differed from BOTH
// neighbours of the 8px gap at the header's left edge — the tab
// strip HEADER_GREY #e6e8eb (230,232,235) above and the header white
// below — plus the sidebar's 1px border, so the gap read as a third,
// separate grey bar running the header's full height. CANVAS now
// EQUALS HEADER_GREY, so the gap blends with the tab-strip row
// (sidebar white | 1px border | strip-grey gap | strip grey, one
// continuous row) while the white header rows below still sit on
// the same light grey as every other card gap (below the header,
// around the main card) — normal card separation, not a bar through
// the header. The tab strip itself is untouched (HEADER_GREY
// unchanged, document-tab-bar.tsx untouched); only the surrounding
// canvas colour changed. Dark mode mirrors this in
// authenticated-layout.tsx: the dark canvas becomes the dark
// tab-strip colour (Background2) instead of Background3.
export const CANVAS = '#e6e8eb'
export const HEADER_GREY = '#e6e8eb'
