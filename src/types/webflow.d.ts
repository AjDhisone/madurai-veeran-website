/**
 * Extend JSX intrinsic elements to allow Webflow custom attributes
 * used by animation scripts (Course-Studio, GSAP, Swiper).
 */

import 'react';

declare module 'react' {
  interface HTMLAttributes<T> {
    /** Webflow stagger-fade animation trigger/item */
    'stagger-fade'?: string;
    /** Webflow dynamic-text wrapper/text */
    'dynamic-text'?: string;
    /** Webflow footer-slide animation identifier */
    'footer-slide'?: string;
    /** Webflow footer Business Class stagger item */
    'footer-bc-stagger'?: string;
    /** Webflow marquee scroller attribute */
    marquee?: string;
    /** Webflow marquee parent (e.g. "pause-hover") */
    'marquee-parent'?: string;
    /** Webflow homepage flag for navbar styling */
    homepage?: string;
    /** Image origin point for hero slider parallax */
    'origin-point'?: string;
  }
}
