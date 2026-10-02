# 0003. How the design source is turned into code

- **Date:** 2 October 2026

## Decision

- Each part of the design is rebuilt as a React component with its own CSS Module, using the exact values from the `.dc.html` source. Class names are scoped, so they cannot collide (C55).
- No global `box-sizing` reset. The design relies on the browser default and sets `border-box` only where it needs it. A global reset made the footer 2px shorter and the partner button 2px smaller than the design.
- Every shared part is compared pixel by pixel with the design previews (`design-pack/previews`) at 390, 760, 1024 and 1440px. Sizes must match exactly and at least 98.5% of pixels must be identical. The small allowance covers text anti-aliasing when a part sits half a pixel lower on one page.
- Accessibility fixes the design did not show are added without changing the look: a skip link, a real disclosure button for the phone menu (the design used `<details>`), "opens in a new tab" text for the partner link, and social icons that are not links until Andrew supplies the addresses (no dead `#` links).
