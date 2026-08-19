import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Activity,
  Users,
  Car,
  Flame,
  Leaf,
  Radio,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Bus,
  Users2,
  MapPin,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  RotateCcw,
  PlayCircle,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens (see plan): near-black telemetry base, blue->violet  */
/*  signal gradient, mono readouts for data, Space Grotesk for display */
/* ------------------------------------------------------------------ */

const FONT_LINK_ID = "flow-fonts";

function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ------------------------------ helpers ------------------------------ */

function useCountUp(target, duration = 900, decimals = 0) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = target;
    if (from === to) return;
    const start = performance.now();
    cancelAnimationFrame(rafRef.current);

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * eased;
      setValue(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
}

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------ primitives ------------------------------ */

function Glass({ className = "", children, glow = false }) {
  return (
    <div
      className={cx(
        "relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl",
        glow && "shadow-[0_0_40px_-12px_rgba(124,92,255,0.35)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function StatusBadge({ level }) {
  const map = {
    LOW: { dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-400/10", ring: "ring-emerald-400/20", label: "LOW" },
    RISING: { dot: "bg-amber-400", text: "text-amber-300", bg: "bg-amber-400/10", ring: "ring-amber-400/20", label: "RISING" },
    HIGH: { dot: "bg-orange-400", text: "text-orange-300", bg: "bg-orange-400/10", ring: "ring-orange-400/20", label: "HIGH" },
    CRITICAL: { dot: "bg-rose-400", text: "text-rose-300", bg: "bg-rose-400/10", ring: "ring-rose-400/20", label: "CRITICAL" },
    MODERATE: { dot: "bg-amber-400", text: "text-amber-300", bg: "bg-amber-400/10", ring: "ring-amber-400/20", label: "MODERATE" },
  };
  const s = map[level] || map.LOW;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ring-1",
        s.bg,
        s.text,
        s.ring
      )}
    >
      <span className={cx("h-1.5 w-1.5 rounded-full", s.dot, level === "CRITICAL" && "animate-pulse")} />
      {s.label}
    </span>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3600);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 animate-[toastIn_.35s_ease-out]">
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#101018]/95 px-4 py-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
          <CheckCircle2 size={16} />
        </div>
        <span className="text-sm text-zinc-100">{message}</span>
        <button onClick={onClose} className="ml-2 text-zinc-500 hover:text-zinc-300 transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ nav ------------------------------ */

function NavBar({ tab, setTab }) {
  const items = [
    { id: "dashboard", label: "Dashboard" },
    { id: "predictions", label: "Predictions" },
    { id: "simulation", label: "Simulation" },
    { id: "impact", label: "Impact" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#08090D]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#5B7CFF] to-[#9B6BFF]">
            <Activity size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-[Space_Grotesk] text-[15px] font-semibold tracking-tight text-white">FLOW</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">Mobility Intelligence</div>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 md:flex">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className={cx(
                "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all",
                tab === it.id
                  ? "bg-gradient-to-r from-[#5B7CFF] to-[#9B6BFF] text-white shadow-[0_0_20px_-4px_rgba(124,92,255,0.6)]"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              {it.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="hidden text-[11px] font-semibold tracking-wide text-emerald-300 sm:inline">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* mobile tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-t border-white/[0.05] px-5 py-2 md:hidden">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className={cx(
              "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all",
              tab === it.id ? "bg-gradient-to-r from-[#5B7CFF] to-[#9B6BFF] text-white" : "text-zinc-400"
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
    </header>
  );
}

/* ------------------------------ hero ------------------------------ */

function Hero({ setTab }) {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.18] blur-[110px]"
        style={{ background: "radial-gradient(closest-side, #6E7CFF, transparent)" }}
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400">
          <Sparkles size={12} className="text-[#9B6BFF]" />
          Predictive transit intelligence
        </div>
        <h1 className="font-[Space_Grotesk] text-[42px] font-semibold leading-[1.05] tracking-tight text-white sm:text-[64px]">
          Move People.
          <br />
          <span className="bg-gradient-to-r from-[#8FA4FF] via-[#B79BFF] to-[#E39BFF] bg-clip-text text-transparent">
            Not Just Cars.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-zinc-400 sm:text-[17px]">
          FLOW predicts commuter demand, identifies congestion before it happens, and recommends smarter
          transportation solutions&nbsp;— before the road ever fills up.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => setTab("simulation")}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5B7CFF] to-[#9B6BFF] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_8px_30px_-8px_rgba(124,92,255,0.7)] transition-transform hover:scale-[1.02]"
          >
            <PlayCircle size={16} />
            Run Simulation
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => setTab("predictions")}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.02] px-6 py-3 text-[14px] font-semibold text-zinc-200 transition-colors hover:bg-white/[0.06]"
          >
            View Predictions
          </button>
        </div>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[12px] text-zinc-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          AI Engine Online &nbsp;·&nbsp; Last prediction: 2 minutes ago
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ metrics ------------------------------ */

function MetricCard({ icon: Icon, label, value, suffix, trend, trendUp, accent }) {
  return (
    <Glass className="group relative overflow-hidden p-5 transition-all hover:border-white/[0.15]">
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-30"
        style={{ background: accent }}
      />
      <div className="flex items-center justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: `${accent}1A`, color: accent }}
        >
          <Icon size={16} />
        </div>
        {trend && (
          <span
            className={cx(
              "inline-flex items-center gap-0.5 text-[11px] font-semibold",
              trendUp ? "text-emerald-400" : "text-rose-400"
            )}
          >
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4 font-[JetBrains_Mono] text-[26px] font-semibold tracking-tight text-white">
        {value}
        {suffix && <span className="ml-1 text-[15px] text-zinc-500">{suffix}</span>}
      </div>
      <div className="mt-1 text-[12.5px] text-zinc-500">{label}</div>
    </Glass>
  );
}

function LiveOverview({ intervened }) {
  const co2 = useCountUp(intervened ? 2.34 : 1.8, 900, 1);
  const hotspots = useCountUp(intervened ? 5 : 7);
  return (
    <section className="mx-auto max-w-7xl px-5 pb-4 sm:px-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard icon={Users} label="Active Commuters" value="12,480" trend="4.2%" trendUp accent="#5B7CFF" />
        <MetricCard icon={Car} label="Vehicles on Network" value="6,240" trend="1.1%" trendUp={false} accent="#9B6BFF" />
        <MetricCard icon={Flame} label="Predicted Congestion" value={hotspots} suffix="hotspots" trend={intervened ? "2 resolved" : undefined} trendUp={false} accent="#FB923C" />
        <MetricCard icon={Leaf} label="CO₂ Avoided Today" value={co2} suffix="T" trend="12.4%" trendUp accent="#34D399" />
      </div>
    </section>
  );
}

/* ------------------------------ forecast timeline (signature) ------------------------------ */

function ForecastRail() {
  const steps = [
    { t: "08:00", level: "LOW" },
    { t: "08:15", level: "RISING" },
    { t: "08:30", level: "HIGH" },
    { t: "08:45", level: "CRITICAL" },
    { t: "09:00", level: "CRITICAL" },
  ];
  const colors = { LOW: "#34D399", RISING: "#FBBF24", HIGH: "#FB923C", CRITICAL: "#FB7185" };

  return (
    <Glass className="p-6 sm:p-8" glow>
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <div className="font-[Space_Grotesk] text-lg font-semibold text-white">AI Congestion Forecast</div>
          <div className="mt-1 text-[13px] text-zinc-500">45-minute rolling prediction window</div>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400">
          <Radio size={13} className="text-[#9B6BFF]" />
          Confidence <span className="font-[JetBrains_Mono] text-white">92%</span>
        </div>
      </div>

      {/* rail */}
      <div className="relative mt-10 px-2">
        <div className="absolute left-2 right-2 top-[15px] h-[2px] rounded-full bg-white/[0.07]" />
        <div
          className="absolute left-2 top-[15px] h-[2px] rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400"
          style={{ width: "calc(100% - 16px)" }}
        />
        <div className="relative flex items-start justify-between">
          {steps.map((s, i) => (
            <div key={s.t} className="flex flex-col items-center" style={{ width: 64 }}>
              <div className="relative flex h-8 w-8 items-center justify-center">
                {i === 3 && (
                  <span
                    className="absolute inline-flex h-8 w-8 animate-ping rounded-full opacity-40"
                    style={{ background: colors[s.level] }}
                  />
                )}
                <span
                  className="relative inline-flex h-3 w-3 rounded-full ring-4 ring-[#08090D]"
                  style={{ background: colors[s.level], boxShadow: `0 0 16px ${colors[s.level]}` }}
                />
              </div>
              <div className="mt-3 font-[JetBrains_Mono] text-[12px] text-zinc-300">{s.t}</div>
              <div className="mt-1.5">
                <StatusBadge level={s.level} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-xl border border-rose-400/15 bg-rose-400/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[14px] font-semibold text-rose-200">Critical congestion predicted in 18 minutes.</div>
          <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-zinc-400">
            <MapPin size={12} />
            College Gate — North Corridor
          </div>
        </div>
      </div>
    </Glass>
  );
}

/* ------------------------------ recommendation panel ------------------------------ */

function RecommendationPanel({ applied, onApply }) {
  return (
    <Glass className="relative overflow-hidden p-6 sm:p-8" glow>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ background: "linear-gradient(135deg, #5B7CFF, transparent 60%)" }}
      />
      <div className="relative flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#5B7CFF] to-[#9B6BFF] text-white">
          <Zap size={15} />
        </div>
        <div className="font-[Space_Grotesk] text-lg font-semibold text-white">FLOW Recommendation</div>
      </div>

      <div className="relative mt-5 flex items-start gap-2.5 rounded-xl border border-orange-400/15 bg-orange-400/[0.06] p-4">
        <Flame size={16} className="mt-0.5 shrink-0 text-orange-400" />
        <div>
          <div className="text-[13px] font-semibold text-orange-200">Congestion Risk Detected</div>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">
            Demand at College Gate is expected to exceed road capacity by <span className="font-[JetBrains_Mono] text-orange-200">31%</span> at 08:45.
          </p>
        </div>
      </div>

      <div className="relative mt-6">
        <div className="flex items-center gap-2 text-[15px] font-semibold text-white">
          <Bus size={16} className="text-[#9B6BFF]" />
          Deploy 2 Shuttle Buses
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Capacity", value: "80", suffix: "pax" },
            { label: "Expected Passengers", value: "68", suffix: "pax" },
            { label: "Vehicles Avoided", value: "55" },
            { label: "CO₂ Avoided", value: "32", suffix: "kg" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="font-[JetBrains_Mono] text-[19px] font-semibold text-white">
                {s.value}
                {s.suffix && <span className="ml-1 text-[12px] text-zinc-500">{s.suffix}</span>}
              </div>
              <div className="mt-0.5 text-[11px] text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onApply}
          disabled={applied}
          className={cx(
            "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold transition-all sm:w-auto",
            applied
              ? "cursor-default border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "bg-gradient-to-r from-[#5B7CFF] to-[#9B6BFF] text-white shadow-[0_8px_30px_-10px_rgba(124,92,255,0.7)] hover:scale-[1.01]"
          )}
        >
          {applied ? (
            <>
              <CheckCircle2 size={15} /> Recommendation Applied
            </>
          ) : (
            <>Apply Recommendation</>
          )}
        </button>
      </div>
    </Glass>
  );
}

/* ------------------------------ before/after ------------------------------ */

function BeforeAfter({ intervened }) {
  const vehiclesWith = useCountUp(intervened ? 430 : 610);
  const reduction = useCountUp(intervened ? 29.5 : 0, 900, 1);
  const avoided = useCountUp(intervened ? 180 : 0);

  const withoutPct = 100;
  const withPct = intervened ? 70.5 : 100;

  return (
    <Glass className="p-6 sm:p-8">
      <div className="font-[Space_Grotesk] text-lg font-semibold text-white">What happens if FLOW intervenes?</div>
      <div className="mt-1 text-[13px] text-zinc-500">College Gate corridor · peak departure window</div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-zinc-500">Without FLOW</span>
            <StatusBadge level="CRITICAL" />
          </div>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full bg-rose-400/80" style={{ width: `${withoutPct}%` }} />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="font-[JetBrains_Mono] text-[18px] font-semibold text-white">850</div>
              <div className="text-[10.5px] text-zinc-500">Commuters</div>
            </div>
            <div>
              <div className="font-[JetBrains_Mono] text-[18px] font-semibold text-white">610</div>
              <div className="text-[10.5px] text-zinc-500">Vehicles</div>
            </div>
            <div>
              <div className="font-[JetBrains_Mono] text-[18px] font-semibold text-rose-300">High</div>
              <div className="text-[10.5px] text-zinc-500">CO₂</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#5B7CFF]/20 bg-[#5B7CFF]/[0.06] p-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#B7C4FF]">With FLOW</span>
            <StatusBadge level={intervened ? "MODERATE" : "CRITICAL"} />
          </div>
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#5B7CFF] to-[#9B6BFF] transition-all duration-700"
              style={{ width: `${withPct}%` }}
            />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="font-[JetBrains_Mono] text-[18px] font-semibold text-white">850</div>
              <div className="text-[10.5px] text-zinc-500">Commuters</div>
            </div>
            <div>
              <div className="font-[JetBrains_Mono] text-[18px] font-semibold text-white">{vehiclesWith}</div>
              <div className="text-[10.5px] text-zinc-500">Vehicles</div>
            </div>
            <div>
              <div className="font-[JetBrains_Mono] text-[18px] font-semibold text-emerald-300">
                {intervened ? "-29%" : "0%"}
              </div>
              <div className="text-[10.5px] text-zinc-500">CO₂</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
        <div>
          <div className="font-[JetBrains_Mono] text-[26px] font-bold bg-gradient-to-r from-[#8FA4FF] to-[#E39BFF] bg-clip-text text-transparent">
            {avoided}
          </div>
          <div className="mt-1 text-[12px] text-zinc-500">vehicles avoided</div>
        </div>
        <div>
          <div className="font-[JetBrains_Mono] text-[26px] font-bold bg-gradient-to-r from-[#8FA4FF] to-[#E39BFF] bg-clip-text text-transparent">
            {reduction}%
          </div>
          <div className="mt-1 text-[12px] text-zinc-500">reduction in road demand</div>
        </div>
      </div>
    </Glass>
  );
}

/* ------------------------------ commuter flow ------------------------------ */

function CommuterFlow() {
  const data = [
    { name: "College Gate", value: 620 },
    { name: "Metro Station", value: 210 },
    { name: "IT Park", value: 140 },
    { name: "Railway Station", value: 95 },
    { name: "Other", value: 75 },
  ];
  const max = data[0].value;

  return (
    <Glass className="p-6 sm:p-8">
      <div className="font-[Space_Grotesk] text-lg font-semibold text-white">Where are people going?</div>
      <div className="mt-1 text-[13px] text-zinc-500">Destination demand, current window</div>

      <div className="mt-6 space-y-4">
        {data.map((d, i) => (
          <div key={d.name}>
            <div className="mb-1.5 flex items-center justify-between text-[13px]">
              <span className="text-zinc-300">{d.name}</span>
              <span className="font-[JetBrains_Mono] text-zinc-400">{d.value}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#5B7CFF] to-[#9B6BFF] transition-all duration-1000 ease-out"
                style={{ width: `${(d.value / max) * 100}%`, transitionDelay: `${i * 80}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Glass>
  );
}

/* ------------------------------ carpool + shuttle ------------------------------ */

function CarpoolPanel({ onView }) {
  return (
    <Glass className="p-6">
      <div className="flex items-center gap-2">
        <Users2 size={16} className="text-[#9B6BFF]" />
        <div className="font-[Space_Grotesk] text-[15px] font-semibold text-white">AI Carpool Clusters</div>
      </div>

      <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center justify-between">
          <span className="font-[JetBrains_Mono] text-[13px] text-zinc-300">Cluster #27</span>
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10.5px] text-zinc-400">08:20 departure</span>
        </div>
        <div className="mt-2 text-[12.5px] leading-relaxed text-zinc-500">
          4 commuters · same origin · same destination
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="font-[JetBrains_Mono] text-[15px] font-semibold text-white">4 cars</span>
          <ArrowRight size={13} className="text-zinc-500" />
          <span className="font-[JetBrains_Mono] text-[15px] font-semibold text-emerald-300">1 car</span>
          <span className="ml-auto text-[11.5px] text-zinc-500">
            <span className="text-emerald-300">−3</span> vehicles avoided
          </span>
        </div>
      </div>

      <button
        onClick={onView}
        className="mt-4 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] py-2.5 text-[13px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.06]"
      >
        View Clusters
      </button>
    </Glass>
  );
}

function ShuttlePanel() {
  return (
    <Glass className="p-6">
      <div className="flex items-center gap-2">
        <Bus size={16} className="text-[#9B6BFF]" />
        <div className="font-[Space_Grotesk] text-[15px] font-semibold text-white">Recommended Shuttle Deployment</div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[12.5px] text-zinc-400">
        <MapPin size={12} />
        Hostel Zone <ArrowRight size={11} /> College Gate
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="font-[JetBrains_Mono] text-[17px] font-semibold text-white">120</div>
          <div className="text-[10.5px] text-zinc-500">current pax/hr</div>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="font-[JetBrains_Mono] text-[17px] font-semibold text-orange-300">198</div>
          <div className="text-[10.5px] text-zinc-500">predicted pax/hr</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-[#5B7CFF]/20 bg-[#5B7CFF]/[0.06] px-4 py-3">
        <span className="text-[13px] font-semibold text-[#C3CDFF]">+2 Shuttle Buses</span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Ready
        </span>
      </div>
    </Glass>
  );
}

/* ------------------------------ predictions page ------------------------------ */

function PredictionCard({ name, level, time, confidence, commuters, capacity, risk, action }) {
  const colors = { CRITICAL: "#FB7185", HIGH: "#FB923C", RISING: "#FBBF24" };
  return (
    <Glass className="p-6 transition-colors hover:border-white/[0.15]">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-[Space_Grotesk] text-[16px] font-semibold text-white">{name}</div>
          <div className="mt-1 flex items-center gap-1.5 text-[12px] text-zinc-500">
            <span className="font-[JetBrains_Mono]">{time}</span>
          </div>
        </div>
        <StatusBadge level={level} />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-[11.5px] text-zinc-500">
          <span>Risk</span>
          <span className="font-[JetBrains_Mono] text-zinc-300">{risk}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full rounded-full" style={{ width: `${risk}%`, background: colors[level] }} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="font-[JetBrains_Mono] text-[16px] font-semibold text-white">{commuters}</div>
          <div className="text-[10.5px] text-zinc-500">expected commuters</div>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="font-[JetBrains_Mono] text-[16px] font-semibold text-white">{capacity}</div>
          <div className="text-[10.5px] text-zinc-500">road capacity</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <span className="text-[12px] text-zinc-500">Confidence</span>
        <span className="font-[JetBrains_Mono] text-[13px] font-semibold text-white">{confidence}%</span>
      </div>
      <div className="mt-3 rounded-lg bg-white/[0.02] px-3 py-2 text-[12px] text-zinc-400">
        <span className="text-zinc-500">Recommended action — </span>
        {action}
      </div>
    </Glass>
  );
}

function PredictionsPage() {
  const preds = [
    {
      name: "College Gate",
      level: "CRITICAL",
      time: "08:45 AM",
      confidence: 92,
      commuters: 850,
      capacity: 650,
      risk: 92,
      action: "Deploy 2 shuttle buses",
    },
    {
      name: "Metro Corridor",
      level: "HIGH",
      time: "09:10 AM",
      confidence: 87,
      commuters: 620,
      capacity: 500,
      risk: 87,
      action: "Stagger departures by 10 min",
    },
    {
      name: "IT Park Road",
      level: "RISING",
      time: "09:20 AM",
      confidence: 81,
      commuters: 480,
      capacity: 430,
      risk: 81,
      action: "Promote carpool matching",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9B6BFF]">Forecast queue</div>
        <h2 className="mt-2 font-[Space_Grotesk] text-[28px] font-semibold text-white">Active Predictions</h2>
        <p className="mt-1 text-[14px] text-zinc-500">Locations FLOW is currently modeling for demand overflow.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {preds.map((p) => (
          <PredictionCard key={p.name} {...p} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ simulation page ------------------------------ */

function SimulationPage({ intervened, running, onRun, onReset }) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <div className="mb-8 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9B6BFF]">Intervention engine</div>
        <h2 className="mt-2 font-[Space_Grotesk] text-[28px] font-semibold text-white">Run FLOW Simulation</h2>
        <p className="mx-auto mt-1 max-w-md text-[14px] text-zinc-500">
          Simulate deploying FLOW's recommendations against the College Gate corridor forecast.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onRun}
          disabled={running}
          className={cx(
            "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-semibold text-white transition-all",
            running
              ? "cursor-wait bg-white/[0.08]"
              : "bg-gradient-to-r from-[#5B7CFF] to-[#9B6BFF] shadow-[0_8px_30px_-8px_rgba(124,92,255,0.7)] hover:scale-[1.02]"
          )}
        >
          {running ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Modeling intervention…
            </>
          ) : (
            <>
              <PlayCircle size={16} />
              Run FLOW Simulation
            </>
          )}
        </button>
        <button
          onClick={onReset}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.02] px-6 py-3.5 text-[14px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.06] disabled:opacity-40"
        >
          <RotateCcw size={14} />
          Reset Simulation
        </button>
      </div>

      <div className="mt-10">
        <BeforeAfter intervened={intervened} />
      </div>
    </section>
  );
}

/* ------------------------------ impact page ------------------------------ */

function ImpactStat({ label, value, suffix, accent }) {
  return (
    <Glass className="p-6 text-center">
      <div className="font-[JetBrains_Mono] text-[30px] font-bold" style={{ color: accent }}>
        {value}
        {suffix && <span className="ml-1 text-[15px] text-zinc-500">{suffix}</span>}
      </div>
      <div className="mt-1.5 text-[12.5px] text-zinc-500">{label}</div>
    </Glass>
  );
}

function ImpactPage() {
  const vehicles = useCountUp(3240);
  const co2 = useCountUp(1.8, 900, 1);
  const shared = useCountUp(2840);
  const reduction = useCountUp(18.7, 900, 1);

  const rows = [
    { label: "Vehicles", from: "610", to: "430" },
    { label: "CO₂", from: "100%", to: "71%" },
    { label: "Congestion", from: "Critical", to: "Moderate" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9B6BFF]">Daily rollup</div>
        <h2 className="mt-2 font-[Space_Grotesk] text-[28px] font-semibold text-white">Today's Estimated Impact</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ImpactStat label="Vehicles avoided" value={vehicles} accent="#8FA4FF" />
        <ImpactStat label="CO₂ avoided" value={co2} suffix="tons" accent="#34D399" />
        <ImpactStat label="Shared trips" value={shared} accent="#B79BFF" />
        <ImpactStat label="Congestion reduction" value={reduction} suffix="%" accent="#FBBF24" />
      </div>

      <Glass className="mt-6 p-6 sm:p-8">
        <div className="font-[Space_Grotesk] text-lg font-semibold text-white">FLOW vs No Intervention</div>
        <div className="mt-6 space-y-5">
          {rows.map((r) => (
            <div key={r.label} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-[13px] text-zinc-400">{r.label}</span>
              <div className="flex items-center gap-3">
                <span className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 font-[JetBrains_Mono] text-[13px] text-zinc-400">
                  {r.from}
                </span>
                <ArrowRight size={14} className="text-zinc-600" />
                <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 font-[JetBrains_Mono] text-[13px] font-semibold text-emerald-300">
                  {r.to}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Glass>
    </section>
  );
}

/* ------------------------------ commuter flow chart (recharts, secondary) ------------------------------ */

function DemandChart() {
  const data = [
    { name: "College Gate", demand: 850, capacity: 650 },
    { name: "Metro Corridor", demand: 620, capacity: 500 },
    { name: "IT Park", demand: 480, capacity: 430 },
  ];
  return (
    <Glass className="p-6 sm:p-8">
      <div className="font-[Space_Grotesk] text-lg font-semibold text-white">Demand vs. Capacity</div>
      <div className="mt-1 text-[13px] text-zinc-500">Monitored corridors, current window</div>
      <div className="mt-6 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={6}>
            <XAxis
              dataKey="name"
              tick={{ fill: "#71717A", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              tickLine={false}
            />
            <YAxis tick={{ fill: "#71717A", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Bar dataKey="capacity" radius={[4, 4, 0, 0]} fill="rgba(255,255,255,0.08)" />
            <Bar dataKey="demand" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.demand > d.capacity ? "#FB7185" : "#5B7CFF"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center gap-4 text-[11.5px] text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-white/20" /> Capacity
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[#5B7CFF]" /> Demand
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[#FB7185]" /> Over capacity
        </span>
      </div>
    </Glass>
  );
}

/* ------------------------------ section label ------------------------------ */

function SectionLabel({ eyebrow, title, sub }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9B6BFF]">{eyebrow}</div>
      <h2 className="mt-2 font-[Space_Grotesk] text-[24px] font-semibold text-white sm:text-[28px]">{title}</h2>
      {sub && <p className="mt-1 text-[14px] text-zinc-500">{sub}</p>}
    </div>
  );
}

/* ------------------------------ pipeline strip ------------------------------ */

function PipelineStrip() {
  const steps = ["Demand Prediction", "Congestion Prediction", "AI Decision", "Intervention", "Measurable Impact"];
  return (
    <div className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 rounded-2xl border border-white/[0.06] bg-white/[0.015] px-5 py-4">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <span className="text-[12px] font-medium text-zinc-400">{s}</span>
            {i < steps.length - 1 && <ChevronRight size={13} className="text-zinc-700" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ dashboard page ------------------------------ */

function DashboardPage({ setTab, intervened, applied, onApply, onView }) {
  return (
    <>
      <Hero setTab={setTab} />
      <LiveOverview intervened={intervened} />
      <PipelineStrip />

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <SectionLabel eyebrow="Forecast" title="Congestion, before it happens" />
        <ForecastRail />
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <SectionLabel eyebrow="Decision" title="What FLOW recommends" />
        <RecommendationPanel applied={applied} onApply={onApply} />
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <SectionLabel eyebrow="Simulation" title="Impact preview" />
        <BeforeAfter intervened={intervened} />
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <CommuterFlow />
          <DemandChart />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <CarpoolPanel onView={onView} />
          <ShuttlePanel />
        </div>
      </section>
    </>
  );
}

/* ------------------------------ root ------------------------------ */

export default function App() {
  useFonts();
  const [tab, setTab] = useState("dashboard");
  const [intervened, setIntervened] = useState(false);
  const [applied, setApplied] = useState(false);
  const [running, setRunning] = useState(false);
  const [toast, setToast] = useState(null);

  const handleApply = useCallback(() => {
    setApplied(true);
    setIntervened(true);
    setToast("Mobility plan applied successfully.");
  }, []);

  const handleRun = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setIntervened(true);
      setApplied(true);
      setToast("FLOW intervention reduced predicted congestion.");
    }, 1400);
  }, []);

  const handleReset = useCallback(() => {
    setIntervened(false);
    setApplied(false);
    setToast(null);
  }, []);

  const handleViewClusters = useCallback(() => {
    setToast("Showing 6 active carpool clusters nearby.");
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#08090D] text-zinc-100" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }
        ::selection { background: rgba(124,92,255,0.35); }
      `}</style>

      <NavBar tab={tab} setTab={setTab} />

      {tab === "dashboard" && (
        <DashboardPage
          setTab={setTab}
          intervened={intervened}
          applied={applied}
          onApply={handleApply}
          onView={handleViewClusters}
        />
      )}
      {tab === "predictions" && <PredictionsPage />}
      {tab === "simulation" && (
        <SimulationPage intervened={intervened} running={running} onRun={handleRun} onReset={handleReset} />
      )}
      {tab === "impact" && <ImpactPage />}

      <footer className="mx-auto max-w-7xl px-5 py-10 text-center text-[12px] text-zinc-600 sm:px-8">
        FLOW Mobility Intelligence — prototype build · simulated data, no live feeds connected.
      </footer>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
