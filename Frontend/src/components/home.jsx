import { ShieldCheck, ArrowRight, HeartHandshake, MapPinned, Users, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function StatBadge({ label, value }) {
  return (
    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-300 flex items-center gap-2">
      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="font-medium text-white/90">{value}</span>
      <span className="text-gray-400">{label}</span>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="px-3 py-1 rounded-full bg-white/5 text-xs sm:text-sm text-gray-300 border border-white/10">
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, subtitle, align = "left" }) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-purple-300/80 mb-3">
        {eyebrow}
      </p>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Home() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("relief_user") || "null");
      setCurrentUser(user);
    } catch (error) {
      setCurrentUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("relief_user");
    localStorage.removeItem("relief_token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
  };

  const dashboardPath = currentUser?.role === "volunteer" ? "/dashboard" : "/user-dashboard";

  return (
    <div className="min-h-screen bg-[#050511] text-white overflow-x-hidden">
      {/* Layered background with diagonal strip instead of blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-x-[-40%] -top-40 h-64 bg-gradient-to-br from-purple-700/40 via-indigo-700/10 to-transparent rotate-[-6deg]" />
        <div className="absolute inset-x-[-30%] top-40 h-72 bg-gradient-to-tr from-sky-600/25 via-transparent to-transparent rotate-[4deg]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Navigation - centered, pill nav to feel different */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#050511]/80 backdrop-blur-2xl">
        <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#050511] border border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.55)]">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-wide">
                ReliefSync
              </span>
              <span className="text-[11px] text-gray-400">
                Coordinate aid. Faster.
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-gray-300 bg-white/5 rounded-full px-2 py-1 border border-white/10">
            <a href="#how-it-works" className="px-3 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors">
              How it works
            </a>
            <a href="#features" className="px-3 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors">
              Features
            </a>
            <a href="#stories" className="px-3 py-1 rounded-full hover:text-white hover:bg-white/5 transition-colors">
              Impact stories
            </a>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <Link
                  to={dashboardPath}
                  className="hidden sm:inline-flex px-4 py-2 text-xs sm:text-sm text-gray-200 hover:text-white border border-white/15 rounded-full hover:border-purple-400/50 hover:bg-white/5 transition-all duration-300"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden sm:inline-flex items-center gap-2 rounded-full text-xs sm:text-sm font-semibold px-5 py-2.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 text-white shadow-lg shadow-purple-500/50 border border-white/20 hover:scale-105 hover:shadow-purple-400/60 hover:shadow-xl hover:-translate-y-0.5 active:scale-100 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-xs sm:text-sm text-gray-200 hover:text-white border border-white/15 rounded-full hover:border-purple-400/50 hover:bg-white/5 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="group hidden sm:inline-flex items-center gap-2 rounded-full text-xs sm:text-sm font-semibold px-5 py-2.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 text-white shadow-lg shadow-purple-500/50 border border-white/20 hover:scale-105 hover:shadow-purple-400/60 hover:shadow-xl hover:-translate-y-0.5 active:scale-100 transition-all duration-300"
                >
                  Register
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </>
            )}
            <Link
              to="/register"
              className="sm:hidden inline-flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 border border-white/20"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero - split layout, simple and clean */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="pt-10 md:pt-16 pb-16 border-b border-white/5">
          <div className="grid md:grid-cols-[1.15fr,0.85fr] gap-10 md:gap-14 items-center">
            {/* Text side */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-xs text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live command for real relief work
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
                Move faster than{" "}
                <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-sky-200 bg-clip-text text-transparent">
                  the disaster
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                ReliefSync replaces scattered sheets and chats with one clear
                picture: every request, volunteer, and delivery, arranged in a
                timeline your whole team understands in seconds.
              </p>

              <div className="flex flex-wrap gap-3">
                <Pill>Floods, storms & heatwaves</Pill>
                <Pill>District & city‑level ops</Pill>
                <Pill>Works on low‑end devices</Pill>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center" id="get-started">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium bg-white text-[#050511] shadow-lg shadow-purple-500/40 hover:bg-slate-100 hover:-translate-y-0.5 transition-transform"
                >
                  Create free volunteer account
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  className="text-sm text-gray-300 hover:text-white underline underline-offset-4 decoration-white/30"
                  onClick={() => {
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  See how it works
                </button>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <StatBadge label="requests synced" value="12k+" />
                <StatBadge label="volunteers connected" value="3.4k" />
                <StatBadge label="avg. response cut" value="↘ 48%" />
              </div>
            </div>

            {/* Visual side: vertical mission timeline instead of dashboard */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/35 via-transparent to-transparent blur-3xl -z-10" />
              <div className="rounded-3xl bg-[#060617]/90 border border-white/10 shadow-2xl shadow-purple-600/40 backdrop-blur-xl p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center border border-white/15">
                      <MapPinned className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Today · Field view</p>
                      <p className="text-sm font-medium text-white">Riverbank cluster</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-[11px] text-emerald-200 border border-emerald-400/40">
                    6 active routes
                  </span>
                </div>

                <div className="relative mt-4 pl-4 space-y-4 text-xs">
                  <div className="absolute left-1 top-1 bottom-1 w-px bg-gradient-to-b from-sky-400 via-purple-500 to-transparent" />

                  {[
                    {
                      time: "09:05",
                      title: "Requests triaged",
                      detail: "12 families marked critical · Ward B3",
                      tone: "text-emerald-300",
                    },
                    {
                      time: "10:12",
                      title: "Boats dispatched",
                      detail: "Team Indigo · 3 boats · 2 medics",
                      tone: "text-sky-300",
                    },
                    {
                      time: "11:40",
                      title: "Supplies delivered",
                      detail: "Flood kits dropped at school shelter",
                      tone: "text-purple-200",
                    },
                  ].map(({ time, title, detail, tone }) => (
                    <div key={time} className="relative flex gap-3">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
                      <div className="space-y-0.5">
                        <p className={`text-[11px] ${tone}`}>{time} · {title}</p>
                        <p className="text-[11px] text-gray-300">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 text-[11px] pt-2">
                  <div className="rounded-2xl bg-[#101020] border border-white/10 p-3 space-y-1">
                    <p className="text-gray-400">Open requests</p>
                    <p className="text-lg font-semibold text-white">37</p>
                    <p className="text-emerald-300">78% assigned</p>
                  </div>
                  <div className="rounded-2xl bg-[#101020] border border-white/10 p-3 space-y-1">
                    <p className="text-gray-400">Teams on ground</p>
                    <p className="text-lg font-semibold text-white">15</p>
                    <p className="text-sky-300">4 medical · 11 supply</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-b from-purple-700/50 to-indigo-700/40 border border-white/20 p-3 space-y-2">
                    <p className="text-gray-100/90 text-xs">Coverage</p>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-emerald-400 to-sky-400" />
                    </div>
                    <p className="text-[11px] text-gray-100/90">Most urgent zones reached</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="py-16 md:py-20 border-b border-white/5 space-y-10"
        >
          <SectionTitle
            eyebrow="workflow"
            title="From chaos to coordinated within minutes"
            subtitle="ReliefSync keeps every request, volunteer, and delivery in one live, auditable timeline so nothing gets lost in chat screenshots."
          />

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: HeartHandshake,
                title: "Capture critical needs",
                body: "Communities or field workers submit structured relief requests with location, urgency, and resources needed.",
                tag: "WhatsApp‑friendly intake links",
              },
              {
                icon: Users,
                title: "Match with volunteers",
                body: "Smart queues route tasks to nearby teams and coordinators, avoiding double‑work across NGOs.",
                tag: "Role‑based dashboards",
              },
              {
                icon: Waves,
                title: "Track every delivery",
                body: "From packing to drop‑off, every step is confirmed, timestamped, and visible to your whole command center.",
                tag: "End‑to‑end visibility",
              },
            ].map(({ icon: Icon, title, body, tag }) => (
              <div
                key={title}
                className="relative rounded-3xl bg-[#0c0c1a] border border-white/10 p-6 flex flex-col gap-4 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3">
                  <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center border border-white/20">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                    {tag}
                  </div>
                </div>
                <div className="relative space-y-2">
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature grid */}
        <section
          id="features"
          className="py-16 md:py-20 border-b border-white/5 space-y-10"
        >
          <SectionTitle
            eyebrow="platform"
            title="Built for coordinators who never sleep"
            subtitle="Everything you need to tame spreadsheets, random calls, and 3 A.M. WhatsApp forwards—without hiring a whole tech team."
          />

          <div className="grid md:grid-cols-[1.1fr,0.9fr] gap-8">
            <div className="rounded-3xl bg-gradient-to-br from-purple-800/40 via-[#101027] to-indigo-800/40 border border-white/15 p-6 space-y-5">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-white/90">
                  Unified relief request inbox
                </p>
                <span className="px-2.5 py-1 rounded-full text-[11px] bg-emerald-500/15 text-emerald-200 border border-emerald-300/30">
                  Live
                </span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">
                See all incoming requests across disasters, cities, and
                partner organizations in one clean, filterable table. No more
                losing urgent cases inside long chat threads.
              </p>
              <div className="mt-4 rounded-2xl bg-black/20 border border-white/10 p-4 text-xs text-gray-200 space-y-3">
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>New requests · Today</span>
                  <span>Sorted by urgency</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Medical help · Flood zone B3", urgency: "Critical", accent: "from-red-500 via-rose-500 to-orange-400" },
                    { label: "Food kits · Riverside camp", urgency: "High", accent: "from-amber-400 via-amber-300 to-yellow-300" },
                    { label: "Blankets · School shelter", urgency: "Medium", accent: "from-sky-400 via-sky-300 to-cyan-300" },
                  ].map(({ label, urgency, accent }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 border border-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-6 w-1.5 rounded-full bg-gradient-to-b ${accent}`}
                        />
                        <span>{label}</span>
                      </div>
                      <span className="text-[11px] text-gray-300">{urgency}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Volunteer rosters that stay in sync",
                  body: "Keep live records of who is available, what they can do, and where they are—without chasing spreadsheets.",
                },
                {
                  title: "Region‑aware routing",
                  body: "Assign missions based on distance, skills, and team capacity so no one region burns out.",
                },
                {
                  title: "Audit‑ready timelines",
                  body: "Show donors and partners exactly how supplies moved, with confirmations for every critical step.",
                },
              ].map(({ title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl bg-[#0c0c1a] border border-white/10 px-4 py-3 hover:border-purple-400/70 transition-colors"
                >
                  <p className="text-sm font-medium text-white mb-1.5">
                    {title}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stories / testimonials */}
        <section
          id="stories"
          className="py-16 md:py-20 border-b border-white/5 space-y-10"
        >
          <SectionTitle
            eyebrow="impact"
            title="Designed with relief teams, not for them"
            subtitle="ReliefSync is shaped with coordinators, volunteers, and community leaders who have lived through floods, storms, and heatwaves."
            align="center"
          />

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                quote:
                  "Before this, I spent nights forwarding screenshots and dropping pins. Now I open one dashboard and know exactly where to send help.",
                name: "Field coordinator · Coastal floods",
              },
              {
                quote:
                  "Our volunteers finally see which requests are covered and which are still waiting. The guilt of ‘did we miss someone?’ is much less.",
                name: "NGO partner · Shelter operations",
              },
              {
                quote:
                  "We use ReliefSync in quiet months for drills and training. When the storm hit, our teams already knew the playbook.",
                name: "City resilience officer",
              },
            ].map(({ quote, name }) => (
              <div
                key={name}
                className="relative rounded-3xl bg-[#0c0c1a] border border-white/10 p-5 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute -top-10 right-0 h-24 w-24 rounded-full bg-purple-600/20 blur-2xl" />
                <p className="relative text-sm text-gray-200 leading-relaxed mb-4">
                  “{quote}”
                </p>
                <p className="relative text-xs text-gray-400">{name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-20">
          <div className="rounded-3xl bg-gradient-to-r from-purple-700/70 via-indigo-700/70 to-sky-600/70 border border-white/20 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl shadow-purple-700/40">
            <div className="space-y-3 max-w-xl">
              <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-white/80">
                start in one afternoon
              </p>
              <h3 className="text-2xl sm:text-3xl font-semibold">
                Turn your next relief mission into a live, shared dashboard.
              </h3>
              <p className="text-sm text-white/90">
                Set up ReliefSync once, reuse it for every flood, heatwave, or
                community drive. No credit card. No long onboarding.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/"; // user can then click register
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-medium bg-white text-[#050511] hover:bg-slate-100 transition-colors"
              >
                Create coordinator account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-white/80">
                Prefer to start as a volunteer?{" "}
                <Link
                  to="/"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/"; // keeps entry simple for now
                  }}
                  className="underline underline-offset-4"
                >
                  Register for free
                </Link>
              </p>
            </div>
          </div>

          <footer className="pt-10 pb-8 text-[11px] sm:text-xs text-gray-500 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} ReliefSync. Built for fast relief.</p>
            <div className="flex gap-4">
              <a href="#how-it-works" className="hover:text-gray-300">
                How it works
              </a>
              <a href="#features" className="hover:text-gray-300">
                Features
              </a>
              <a href="#stories" className="hover:text-gray-300">
                Impact
              </a>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default Home;

