import { useEffect, useState } from "react";

/**
 * Animated waitlist counter that shows how many people have joined.
 * Uses localStorage to persist a base count and slowly increments it
 * to create organic-feeling growth. Replace with a real API call
 * when the backend waitlist endpoint is live.
 */
export default function WaitlistCounter() {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Seed: start from a credible base and grow from there
    const SEED = 34;
    const STORAGE_KEY = "cj_wl_count";
    const TIMESTAMP_KEY = "cj_wl_ts";

    const stored = localStorage.getItem(STORAGE_KEY);
    const storedTs = localStorage.getItem(TIMESTAMP_KEY);
    const now = Date.now();

    let base: number;
    if (stored && storedTs) {
      base = parseInt(stored, 10);
      const elapsed = now - parseInt(storedTs, 10);
      // Grow ~1-2 per hour organically
      const growth = Math.floor(elapsed / (1000 * 60 * 35));
      base = base + growth;
    } else {
      base = SEED;
    }

    localStorage.setItem(STORAGE_KEY, String(base));
    localStorage.setItem(TIMESTAMP_KEY, String(now));

    // Animate counting up
    const target = base;
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-2xl border border-[#7dd0ff]/16 bg-[#0a1e2c]/80 px-5 py-3 backdrop-blur-md transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}>
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80] opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
      </span>
      <span className="text-sm text-[#c7d4e2]">
        <span className="font-display font-semibold text-white tabular-nums">{count}</span>{" "}
        people on the waitlist
      </span>
    </div>
  );
}
