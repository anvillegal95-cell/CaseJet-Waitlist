import { useCallback, useEffect, useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

interface ReferralBoostProps {
  /** Email the user just signed up with — used to generate a unique referral link. */
  email: string;
}

/**
 * Post-signup referral card. Shows the user their waitlist position and
 * gives them a unique share link. Each referral bumps them up in the queue.
 *
 * Position is stored locally and the referral code is a simple hash of
 * their email. Replace with a real backend lookup when the API is live.
 */
export default function ReferralBoost({ email }: ReferralBoostProps) {
  const [position, setPosition] = useState(0);
  const [copied, setCopied] = useState(false);
  const [referralUrl, setReferralUrl] = useState("");

  useEffect(() => {
    // Generate a simple referral code from email
    const code = btoa(email.toLowerCase().trim())
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 8)
      .toLowerCase();

    const url = `${window.location.origin}?ref=${code}`;
    setReferralUrl(url);

    // Assign position (use stored if returning, otherwise generate)
    const POSITION_KEY = `cj_wl_pos_${code}`;
    const stored = localStorage.getItem(POSITION_KEY);
    if (stored) {
      setPosition(parseInt(stored, 10));
    } else {
      // Simulate a realistic position based on current seed
      const base = parseInt(localStorage.getItem("cj_wl_count") || "34", 10);
      const pos = base + 1;
      localStorage.setItem(POSITION_KEY, String(pos));
      setPosition(pos);
    }
  }, [email]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = referralUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [referralUrl]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "CaseJet — AI Legal Tech",
          text: "I just joined the CaseJet waitlist. Use my link to jump ahead in line:",
          url: referralUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  }, [referralUrl, handleCopy]);

  if (!email || !referralUrl) return null;

  return (
    <div className="space-y-4 rounded-[1.3rem] border border-[#4ade80]/20 bg-[#0a2418]/80 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4ade80]">
            You're on the list
          </p>
          <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-white">
            #{position}
          </p>
          <p className="mt-1 text-sm text-[#a3d4b8]">Your waitlist position</p>
        </div>
        <div className="rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10 p-3">
          <Check className="h-5 w-5 text-[#4ade80]" />
        </div>
      </div>

      <div className="divider-fade" />

      <div>
        <p className="text-sm font-semibold text-white">Move up the list</p>
        <p className="mt-1 text-sm leading-6 text-[#a3d4b8]">
          Share your referral link — each signup from your link bumps you up 3 spots.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 truncate rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-[#c7d4e2]">
          {referralUrl}
        </div>
        <button
          onClick={handleCopy}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#c7d4e2] transition hover:bg-white/[0.1] hover:text-white"
          title="Copy link">
          {copied ? <Check className="h-4 w-4 text-[#4ade80]" /> : <Copy className="h-4 w-4" />}
        </button>
        <button
          onClick={handleShare}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#c7d4e2] transition hover:bg-white/[0.1] hover:text-white"
          title="Share">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {copied && (
        <p className="text-xs text-[#4ade80]">Link copied to clipboard!</p>
      )}
    </div>
  );
}
