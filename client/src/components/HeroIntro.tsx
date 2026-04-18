// Design philosophy: Forensic Futurism — the intro overlay should feel cinematic but disciplined,
// playing the CaseJet jet-streak logo animation with audio before the user lands in the control room.
import { useEffect, useRef, useState } from "react";

const INTRO_SESSION_KEY = "casejet:intro-played";

type HeroIntroProps = {
  /** When the intro has finished (ended, skipped, or suppressed), fire this callback. */
  onFinish: () => void;
  /** Force-play the intro regardless of session storage (useful for dev/testing). */
  forcePlay?: boolean;
};

export default function HeroIntro({ onFinish, forcePlay = false }: HeroIntroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);
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

    // If the video was cut short by an error, skip the fade to avoid stalling.
    if (reason === "error") {
      onFinish();
      return;
    }

    setIsExiting(true);
    window.setTimeout(() => {
      onFinish();
    }, 650);
  }

  // Try to autoplay with audio. Browsers (especially Safari/iOS) often block sound
  // autoplay without a user gesture, so fall back to a "tap to play" prompt.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 0.9;

    const playPromise = video.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(() => {
        // Autoplay with sound was blocked. Show the tap prompt; the click handler
        // on the overlay will start playback with audio after the user gesture.
        setNeedsTapToPlay(true);
      });
    }
  }, []);

  // Allow users to hit Escape to skip the intro.
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

  function handleTapToPlay() {
    const video = videoRef.current;
    if (!video) {
      finish("skipped");
      return;
    }
    video.muted = false;
    video.play()
      .then(() => setNeedsTapToPlay(false))
      .catch(() => {
        // If unmuted play still fails, start muted so the animation at least runs.
        video.muted = true;
        video.play().catch(() => finish("error"));
        setNeedsTapToPlay(false);
      });
  }

  // Force-play support: clear the session key so the effect below triggers fresh playback.
  useEffect(() => {
    if (forcePlay) {
      try {
        sessionStorage.removeItem(INTRO_SESSION_KEY);
      } catch {
        // no-op
      }
    }
  }, [forcePlay]);

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

      {/* Tap-to-play prompt shown only when autoplay-with-sound is blocked. */}
      {needsTapToPlay ? (
        <button
          type="button"
          onClick={handleTapToPlay}
          className="absolute inset-0 flex items-center justify-center bg-[#04090e]/55 text-white backdrop-blur-sm">
          <span className="flex flex-col items-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/5 transition hover:bg-white/10">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 translate-x-0.5 fill-white"
                aria-hidden="true">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11.14-6.86a1 1 0 0 0 0-1.72L9.52 4.28A1 1 0 0 0 8 5.14z" />
              </svg>
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#cad8e6]">
              Tap to enter CaseJet
            </span>
          </span>
        </button>
      ) : null}

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
