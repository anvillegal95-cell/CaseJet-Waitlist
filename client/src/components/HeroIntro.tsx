// Design philosophy: Forensic Futurism — the intro overlay should feel cinematic but disciplined,
// playing the CaseJet jet-streak logo animation silently on arrival before fading into the control room.
//
// Note: the video is intentionally muted. Muted autoplay is universally allowed across browsers,
// which lets the animation run instantly on arrival with zero user interaction required.
import { useEffect, useRef, useState } from "react";

const INTRO_SESSION_KEY = "casejet:intro-played";

type HeroIntroProps = {
  /** When the intro has finished (ended, skipped, or errored), fire this callback. */
  onFinish: () => void;
};

export default function HeroIntro({ onFinish }: HeroIntroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const finishedRef = useRef(false);

  // Kick off the fade-out, then invoke onFinish after the transition completes.
  function finish(reason: "ended" | "skipped" | "error") {
    if (finishedRef.current) return;
    finishedRef.current = true;

    // Mark the intro as played for this session so reloads go straight to the page.
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      // sessionStorage may be disabled; that's fine, the intro will just replay.
    }

    // If the video errored out, skip the fade to avoid stalling on a blank overlay.
    if (reason === "error") {
      onFinish();
      return;
    }

    setIsExiting(true);
    window.setTimeout(() => {
      onFinish();
    }, 650);
  }

  // Belt-and-suspenders: explicitly call play() once mounted. autoPlay + muted + playsInline
  // is the browser-supported combination for silent autoplay on arrival across desktop and mobile.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => finish("error"));
    }
  }, []);

  // Allow users to hit Escape / Enter / Space to skip the intro.
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        finish("skipped");
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#04090e] transition-opacity duration-[650ms] ease-out ${
        isExiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-label="CaseJet intro animation"
      aria-live="polite">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/casejet-hero-intro.mp4"
        poster="/casejet-hero-intro-poster.jpg"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => finish("ended")}
        onError={() => finish("error")}
      />

      {/* Subtle vignette to sit the wordmark in a premium frame. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(4,9,14,0.55)_100%)]"
      />

      {/* Skip button — always available so users are never trapped in the intro. */}
      <button
        type="button"
        onClick={() => finish("skipped")}
        className="absolute bottom-6 right-6 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#cad8e6] backdrop-blur-md transition hover:border-white/40 hover:bg-white/10 hover:text-white sm:bottom-8 sm:right-8"
        aria-label="Skip intro">
        Skip intro →
      </button>
    </div>
  );
}

/**
 * Utility: should the intro play on this visit?
 * Exported so Home (or any page) can decide whether to render the overlay at all.
 */
export function shouldPlayIntro(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SESSION_KEY) !== "1";
  } catch {
    return true;
  }
}
