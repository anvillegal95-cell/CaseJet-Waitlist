// Centralized analytics event helpers for CaseJet waitlist.
// Fires events to GA4, Meta Pixel, and TikTok Pixel simultaneously.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void; page: () => void };
    dataLayer?: unknown[];
  }
}

/** Fire a custom GA4 event. */
function ga4Event(name: string, params?: Record<string, unknown>) {
  window.gtag?.('event', name, params);
}

/** Fire a Meta Pixel event. */
function metaEvent(name: string, params?: Record<string, unknown>) {
  window.fbq?.('track', name, params);
}

/** Fire a TikTok Pixel event. */
function tiktokEvent(name: string, params?: Record<string, unknown>) {
  window.ttq?.track(name, params);
}

// ─── Public event helpers ───────────────────────────────────────────

/** Waitlist form submitted successfully. This is the primary conversion event. */
export function trackWaitlistSignup(interest: string, source: string) {
  ga4Event('generate_lead', { interest, source, currency: 'USD', value: 0 });
  metaEvent('Lead', { content_name: 'waitlist_signup', content_category: interest });
  tiktokEvent('SubmitForm', { content_name: 'waitlist_signup', content_type: interest });
}

/** User clicked a CTA button (hero, pricing, nav). */
export function trackCTAClick(label: string, section: string) {
  ga4Event('cta_click', { label, section });
  metaEvent('ViewContent', { content_name: label, content_category: section });
}

/** User selected an interest type (Personal vs Attorney). */
export function trackInterestSelect(interest: string) {
  ga4Event('interest_select', { interest });
}

/** User scrolled to a key section. */
export function trackSectionView(section: string) {
  ga4Event('section_view', { section });
}
