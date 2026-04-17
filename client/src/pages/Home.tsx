// Design philosophy: Forensic Futurism — this page should feel like a premium legal-tech control room,
// with asymmetrical storytelling, evidence-board structure, and restrained, high-credibility motion.
import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, Globe, Phone } from "lucide-react";

type Interest = "Personal Case" | "Attorney";

type FormState = {
  fullName: string;
  email: string;
  interest: Interest;
  website: string;
};

const waitlistEndpoint = import.meta.env.VITE_WAITLIST_ENDPOINT?.trim() ?? "";

const logoUrl =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663460816240/Zhq7bxm5unVRwkDMeRwjdX/Alter_the_color_scheme_to_inco_Nano_Banana_2_60586_f16e9bea.jpg";
const cockpitGridMotion =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663460816240/Zhq7bxm5unVRwkDMeRwjdX/casejet-cockpit-grid-loop_f73c36a4.mp4";
const metalWaveMotion =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663460816240/Zhq7bxm5unVRwkDMeRwjdX/casejet-metal-wave-loop_6db7d856.mp4";
const cyanCoreMotion =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663460816240/Zhq7bxm5unVRwkDMeRwjdX/casejet-cyan-core-loop_48b5269f.mp4";

const commandStrip = [
  "Plain-English treatment timelines",
  "AI-powered medical-record extraction",
  "Defense-risk analysis and drafting workflows",
];

const personalFeatures = [
  "Upload accident or incident reports and supporting medical records in one place.",
  "Receive a factual, plain-English summary of treatment history, diagnoses, providers, and timing.",
  "Use an organized record view to prepare for intake, insurance conversations, or attorney review.",
];

const attorneyFeatures = [
  "Parallel chunking and extraction across large medical-record sets for faster review.",
  "Structured summaries that surface timeline gaps, provider patterns, and case-critical details.",
  "Defense-risk analysis to pressure test the file before negotiation or demand drafting.",
  "Demand letter drafting shaped by the firm's own voice through a reusable style library.",
];

const personalPlans = [
  { name: "Single Summary", price: "$29", cadence: "one-time", detail: "One organized summary" },
  { name: "Investigator", price: "$39", cadence: "/month", detail: "Up to 3 summaries" },
  { name: "Explorer", price: "$59", cadence: "/month", detail: "Up to 6 summaries" },
];

const attorneyPlans = [
  { name: "Founder", detail: "Early access for forward-leaning firms" },
  { name: "Solo", detail: "Built for lean plaintiff practices" },
  { name: "Firm", detail: "For teams standardizing drafting and review" },
];

export default function Home() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    interest: "Personal Case",
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const teaserLabel = useMemo(
    () => (form.interest === "Attorney" ? "Attorney early access queue" : "Personal Case launch queue"),
    [form.interest],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.website.trim()) {
      return;
    }

    if (!waitlistEndpoint || waitlistEndpoint.includes("YOUR_DEPLOYMENT_ID")) {
      setFeedback({
        type: "error",
        message:
          "This preview is ready for launch, but the Google Apps Script endpoint still needs to be connected. Add VITE_WAITLIST_ENDPOINT to activate submissions.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback(null);

      const payload = new URLSearchParams({
        fullName: form.fullName,
        email: form.email,
        interest: form.interest,
        source: "CaseJet.ai waitlist",
        submittedAt: new Date().toISOString(),
      });

      await fetch(waitlistEndpoint, {
        method: "POST",
        mode: "no-cors",
        body: payload,
      });

      setFeedback({
        type: "success",
        message:
          "Request sent. You have been added to the CaseJet waitlist, and the launch team can now follow up with early-access details.",
      });
      setForm({ fullName: "", email: "", interest: form.interest, website: "" });
    } catch {
      setFeedback({
        type: "error",
        message:
          "The waitlist request could not be sent right now. Please try again in a moment or reconnect the Google Apps Script endpoint.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-shell min-h-screen text-foreground">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#071019]/70 backdrop-blur-xl">
        <div className="container flex items-center justify-between gap-4 py-4">
          <a href="#top" className="flex items-center gap-3 text-sm text-white/90 transition hover:text-white">
            <img src={logoUrl} alt="CaseJet" className="h-10 w-auto" />
          </a>

          <nav className="hidden items-center gap-6 text-sm text-[#b8c8db] md:flex">
            <a href="#products" className="transition hover:text-white">
              Products
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
            <a href="#waitlist" className="transition hover:text-white">
              Waitlist
            </a>
          </nav>

          <a
            href="#waitlist"
            className="metal-button inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5">
            Join Waitlist
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden pb-16 pt-14 sm:pt-20 lg:pb-24 lg:pt-20" style={{
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect fill="%23071019" width="1" height="1"/></svg>')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="absolute inset-0 -z-10">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
              style={{ filter: "brightness(0.5) contrast(1.2)" }}>
              <source src={metalWaveMotion} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-[#071019]/70 to-[#071019]/50" />
          </div>
          <div className="container grid items-start gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 relative z-10">
            <div className="relative z-10 max-w-3xl">
              <span className="section-tag">Coming Soon • Early Access Opening</span>

              <div className="mt-7 space-y-6">
                <p className="max-w-xl text-sm uppercase tracking-[0.32em] text-[#88b5df]">
                  AI-powered case organization for consumers and plaintiff firms
                </p>
                <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                  Case intelligence,
                  <span className="block text-[#8ad8ff]">organized before the argument starts.</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[#cad6e4] sm:text-xl">
                  <strong className="font-semibold text-white">CaseJet</strong> turns raw reports, medical records,
                  and litigation documents into structured, factual workflows. Individuals get plain-English record
                  organization. Attorneys get extraction, risk insight, and drafting support built for real case prep.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {commandStrip.map((item) => (
                  <span key={item} className="stat-chip">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
                <a
                  href="#waitlist"
                  className="metal-button inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5">
                  Reserve your spot
                  <ArrowRight className="h-4 w-4" />
                </a>
                <p className="max-w-xl text-sm leading-6 text-[#9fb2c8]">
                  Launch access will roll out in waves for <span className="text-white">Personal Case</span> users and
                  <span className="text-white"> attorney teams</span>. Join now to receive release updates and onboarding
                  details first.
                </p>
              </div>
            </div>

            <div className="relative lg:pt-8">
              <div className="case-panel soft-noise overflow-hidden p-4 sm:p-5">
                <div
                  className="relative min-h-[470px] rounded-[1.35rem] border border-white/10 bg-[#09131d] bg-cover bg-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full rounded-[1.35rem] object-cover"
                    style={{ filter: "brightness(0.6) contrast(1.1)" }}>
                    <source src={metalWaveMotion} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(131,216,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,214,125,0.12),transparent_20%)]" />
                  <div className="relative flex min-h-[470px] flex-col justify-between p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <span className="section-tag">Launch Preview</span>
                      <div className="rounded-full border border-[#f1c97b]/20 bg-[#f1c97b]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f6d598]">
                        CaseJet.ai
                      </div>
                    </div>

                    <div className="max-w-md space-y-5">
                      <div className="case-panel-soft max-w-sm p-5">
                        <p className="card-label">Platform signal</p>
                        <p className="mt-3 font-display text-2xl font-semibold text-white">
                          From intake file chaos to structured case-ready intelligence.
                        </p>
                        <div className="divider-fade my-4" />
                        <div className="grid grid-cols-2 gap-3 text-sm text-[#d5dfeb]">
                          <div>
                            <p className="card-label">Paths</p>
                            <p className="mt-1 text-white">Personal Case + Attorney</p>
                          </div>
                          <div>
                            <p className="card-label">Launch posture</p>
                            <p className="mt-1 text-white">Coming soon</p>
                          </div>
                        </div>
                      </div>

                      <div className="ml-auto max-w-[17rem] rounded-[1.25rem] border border-[#7dd0ff]/18 bg-[#07111a]/76 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-lg">
                        <p className="card-label">Built for</p>
                        <p className="mt-2 text-sm leading-6 text-[#d7e2ef]">
                          People who need factual record organization, and firms that need faster medical-record
                          extraction, analysis, and drafting workflow support.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-8">
          <div className="container">
            <div className="case-panel px-6 py-5 sm:px-8">
              <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
                <div>
                  <p className="card-label">What is launching</p>
                  <h2 className="mt-2 max-w-lg text-2xl font-semibold text-white sm:text-3xl">
                    Two entry points. One disciplined legal-tech product language.
                  </h2>
                </div>
                <div className="grid gap-3 text-sm leading-7 text-[#d6e1ec] sm:grid-cols-3">
                  <div className="case-panel-soft p-4">
                    Personal Case summaries that organize treatment history without giving legal advice.
                  </div>
                  <div className="case-panel-soft p-4">
                    Attorney workflows for extraction, analysis, and demand drafting in the firm’s own voice.
                  </div>
                  <div className="case-panel-soft p-4">
                    A launch experience designed to feel measured, factual, and premium from day one.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="pb-10 pt-8 lg:pt-12">
          <div className="container space-y-6">
            <span className="section-tag">Product paths</span>
            <div className="grid gap-6 lg:grid-cols-2">
              <article className="case-panel overflow-hidden p-5 sm:p-6">
                <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr] xl:items-center">
                  <div className="min-h-[500px] rounded-[1.35rem] border border-white/10 overflow-hidden">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover"
                      style={{ filter: "brightness(0.7) contrast(1.15)" }}>
                      <source src={cockpitGridMotion} type="video/mp4" />
                    </video>
                  </div>
                  <div>
                    <p className="card-label">For individuals</p>
                    <h3 className="mt-3 max-w-sm font-display text-3xl font-semibold text-white">
                      <span className="text-[#8ad8ff]">CaseJet.AI</span> brings order to reports, records, and treatment history.
                    </h3>
                    <p className="mt-4 text-base leading-7 text-[#cad7e4]">
                      Upload accident or incident reports plus medical records, then receive a clean factual summary that
                      makes the story easier to follow. The product is designed to help people understand what happened,
                      when care occurred, who treated them, and what diagnoses appear in the file.
                    </p>
                    <ul className="feature-list mt-5 space-y-3 text-sm leading-6 text-[#dce7f3]">
                      {personalFeatures.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                    <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#f3cd85]">
                      No legal advice. Just factual organization.
                    </p>
                  </div>
                </div>
              </article>

              <article className="case-panel overflow-hidden p-5 sm:p-6">
                <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
                  <div>
                    <p className="card-label">For attorneys</p>
                    <h3 className="mt-3 max-w-sm font-display text-3xl font-semibold text-white">
                      Attorney workflows built for extraction, review speed, and strategic drafting.
                    </h3>
                    <p className="mt-4 text-base leading-7 text-[#cad7e4]">
                      CaseJet helps firms handle large medical-record sets with structured extraction and summarization,
                      then pushes beyond summary into defense-risk analysis and demand drafting support aligned with the
                      firm’s own style library.
                    </p>
                    <ul className="feature-list mt-5 space-y-3 text-sm leading-6 text-[#dce7f3]">
                      {attorneyFeatures.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="min-h-[500px] rounded-[1.35rem] border border-white/10 overflow-hidden">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover"
                      style={{ filter: "brightness(0.7) contrast(1.15)" }}>
                      <source src={cyanCoreMotion} type="video/mp4" />
                    </video>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="pricing" className="pb-12 pt-6 lg:pt-10">
          <div className="container grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="case-panel p-6 sm:p-7">
              <span className="section-tag">Launch pricing signal</span>
              <h2 className="mt-6 max-w-xl text-3xl font-semibold text-white sm:text-4xl">
                Clear starting tiers for Personal Case, and an early-access track for firms.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#cad8e6]">
                CaseJet is designed to feel accessible for individuals while remaining serious enough for professional
                litigation workflows. Personal Case pricing is already defined. Attorney access will open through a
                staged rollout beginning with the founder cohort.
              </p>
              <div className="divider-fade my-6" />
              <div className="rounded-[1.2rem] border border-[#f1c97b]/16 bg-[#f1c97b]/6 p-4 text-sm leading-6 text-[#f5dfb6]">
                Join the waitlist to receive launch timing, attorney onboarding details, and first access to product
                updates as CaseJet.ai moves toward release.
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="case-panel p-6 sm:p-7">
                <p className="card-label">Personal Case</p>
                <div className="mt-5 space-y-4">
                  {personalPlans.map((plan) => (
                    <div key={plan.name} className="case-panel-soft p-4">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <h3 className="font-display text-xl font-semibold text-white">{plan.name}</h3>
                          <p className="mt-1 text-sm text-[#c5d3e2]">{plan.detail}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-3xl font-semibold text-[#92dcff]">{plan.price}</p>
                          <p className="text-xs uppercase tracking-[0.18em] text-[#9cb5cc]">{plan.cadence}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="case-panel p-6 sm:p-7">
                <p className="card-label">Attorney product</p>
                <div className="mt-5 space-y-4">
                  {attorneyPlans.map((plan) => (
                    <div key={plan.name} className="case-panel-soft p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-display text-xl font-semibold text-white">{plan.name}</h3>
                          <p className="mt-1 text-sm text-[#c5d3e2]">{plan.detail}</p>
                        </div>
                        <span className="rounded-full border border-[#7dcfff]/18 bg-[#7dcfff]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#bceaff]">
                          Coming soon
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="waitlist" className="pb-20 pt-6 lg:pt-10">
          <div className="container">
            <div className="case-panel overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[0.96fr_1.04fr]">
                <div
                  className="relative overflow-hidden border-b border-white/8 p-6 sm:p-8 lg:border-b-0 lg:border-r"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(7,12,18,0.8), rgba(7,12,18,0.92))`, backgroundSize: "cover", backgroundPosition: "center" }}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,190,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,214,125,0.12),transparent_24%)]" />
                  <div className="relative max-w-xl">
                    <span className="section-tag">Join the waitlist</span>
                    <h2 className="mt-6 max-w-lg text-3xl font-semibold text-white sm:text-4xl">
                      Be first in line when CaseJet opens access.
                    </h2>
                    <p className="mt-4 max-w-lg text-base leading-7 text-[#ced9e5]">
                      Select the product path you care about, leave your name and email, and the team will keep you
                      posted as early access opens. This landing page is already wired for a Google Sheets waitlist flow.
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <div className="case-panel-soft p-4">
                        <p className="card-label">Current queue</p>
                        <p className="mt-2 font-display text-xl font-semibold text-white">{teaserLabel}</p>
                        <p className="mt-2 text-sm leading-6 text-[#c7d4e2]">
                          Choose the audience path that fits your use case and the form will submit that preference.
                        </p>
                      </div>
                      <div className="case-panel-soft p-4">
                        <p className="card-label">Integration note</p>
                        <p className="mt-2 text-sm leading-6 text-[#c7d4e2]">
                          The frontend is ready to send form submissions to a deployed Google Apps Script web app that
                          appends new entries into Google Sheets.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 lg:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <p className="card-label">Interested in</p>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        {(["Personal Case", "Attorney"] as Interest[]).map((option) => {
                          const active = form.interest === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setForm((current) => ({ ...current, interest: option }))}
                              className={`rounded-2xl border px-4 py-4 text-left transition ${
                                active
                                  ? "border-[#7fd6ff]/42 bg-[#0d2a3b] text-white shadow-[0_18px_40px_rgba(16,96,150,0.24)]"
                                  : "border-white/10 bg-white/[0.03] text-[#c9d6e3] hover:border-[#7fd6ff]/24 hover:bg-white/[0.05]"
                              }`}>
                              <span className="block font-display text-lg font-semibold">{option}</span>
                              <span
                                className={`mt-1 block text-sm ${
                                  active ? "text-[#d8ebf8]" : "text-[#97a9bc]"
                                }`}>

                                {option === "Personal Case"
                                  ? "For individuals organizing reports and treatment records."
                                  : "For plaintiff firms building extraction and drafting workflows."}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="space-y-2">
                        <span className="card-label">Full name</span>
                        <input
                          className="glow-input h-12 w-full px-4 py-3"
                          type="text"
                          name="fullName"
                          autoComplete="name"
                          placeholder="Your full name"
                          value={form.fullName}
                          onChange={(event) =>
                            setForm((current) => ({ ...current, fullName: event.target.value }))
                          }
                          required
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="card-label">Email</span>
                        <input
                          className="glow-input h-12 w-full px-4 py-3"
                          type="email"
                          name="email"
                          autoComplete="email"
                          placeholder="you@firm.com"
                          value={form.email}
                          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                          required
                        />
                      </label>
                    </div>

                    <input
                      type="text"
                      name="website"
                      value={form.website}
                      onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      aria-hidden="true"
                    />

                    <div className="case-panel-soft p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-display text-xl font-semibold text-white">Launch access request</p>
                          <p className="mt-1 text-sm leading-6 text-[#c7d4e2]">
                            Submission target: Google Sheets waitlist via Apps Script endpoint.
                          </p>
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="metal-button inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0">
                          {isSubmitting ? "Submitting..." : "Request early access"}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {feedback ? (
                      <div
                        className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
                          feedback.type === "success"
                            ? "border-[#7fd6ff]/28 bg-[#0a2534] text-[#d6f2ff]"
                            : "border-[#f1c97b]/28 bg-[#2a1d0c] text-[#f6dfb8]"
                        }`}>
                        {feedback.message}
                      </div>
                    ) : null}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 bg-[#060c12]/80 py-8">
        <div className="container grid gap-6 text-sm text-[#b9c8d8] lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <img src={logoUrl} alt="CaseJet" className="h-8 w-auto mb-3" />
            <p className="font-display text-xl font-semibold text-white">CaseJet Legal Tech</p>
            <p className="mt-2 max-w-2xl leading-7 text-[#c4d3e2]">
              Launching soon at <span className="text-white">CaseJet.ai</span> with factual organization for
              individuals and litigation-grade AI workflows for attorneys.
            </p>
          </div>

          <div className="grid gap-2 text-left lg:text-right">
            <a
              href="https://CaseJet.ai"
              className="inline-flex items-center gap-2 text-[#c9d7e4] transition hover:text-white lg:justify-end">
              <Globe className="h-4 w-4" />
              CaseJet.ai
            </a>
            <a
              href="tel:+16813076412"
              className="inline-flex items-center gap-2 text-[#c9d7e4] transition hover:text-white lg:justify-end">
              <Phone className="h-4 w-4" />
              CaseJet • +1 681 307 6412
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
