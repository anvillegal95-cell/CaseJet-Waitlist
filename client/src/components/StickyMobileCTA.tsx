import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

/**
 * Floating "Join Waitlist" button fixed to the bottom of the viewport on mobile.
 * Only appears after the user scrolls past the hero section and hides if
 * they're already near the waitlist form.
 */
export default function StickyMobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.8;
      const pageHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const nearBottom = scrollY + viewportHeight > pageHeight - 600;

      setShow(scrollY > heroHeight && !nearBottom);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-[#071019]/90 px-4 pb-[env(safe-area-inset-bottom,8px)] pt-3 backdrop-blur-xl transition-all duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}>
      <a
        href="#waitlist"
        onClick={() => trackCTAClick("Join Waitlist", "sticky-mobile")}
        className="metal-button flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5">
        Join Waitlist — Lock In Founder Pricing
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
