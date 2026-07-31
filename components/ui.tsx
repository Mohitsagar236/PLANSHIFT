import Link from "next/link";
import { clsx } from "clsx";
import { BarChart3, Bell, Database, FileText, Gauge, GitCompare, Home, Layers3, Search, Settings, Users, Wand2 } from "lucide-react";

export function Button({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-sea px-4 py-2 text-sm font-semibold text-white shadow-panel transition hover:-translate-y-0.5 hover:bg-[#0B5B5F] focus:outline-none focus:ring-2 focus:ring-sea focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={clsx("rounded-md border border-white/70 bg-white/95 p-5 shadow-panel ring-1 ring-slate-900/5", className)}>{children}</section>;
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "bad" }) {
  return (
    <span
      className={clsx("inline-flex items-center rounded px-2 py-1 text-xs font-semibold", {
        "bg-slate-100 text-slate-700 ring-1 ring-slate-200": tone === "neutral",
        "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100": tone === "good",
        "bg-amber-50 text-amber-800 ring-1 ring-amber-100": tone === "warn",
        "bg-red-50 text-red-700 ring-1 ring-red-100": tone === "bad"
      })}
    >
      {children}
    </span>
  );
}

export function PageHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-sea">PlanShift workspace</p>
        <h1 className="text-3xl font-semibold tracking-normal text-ink md:text-4xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">{description}</p>
      </div>
      {action}
    </div>
  );
}

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/plans", label: "Plans", icon: Layers3 },
  { href: "/features", label: "Features", icon: Wand2 },
  { href: "/imports", label: "Imports", icon: Database },
  { href: "/simulations", label: "Simulations", icon: Gauge },
  { href: "/strategy-comparison", label: "Strategies", icon: GitCompare },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/case-study", label: "Case Study", icon: FileText }
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/70 bg-[#111A1F] p-4 text-white shadow-lift lg:block">
        <Link href="/" className="mb-6 flex items-center gap-3 rounded-md px-2 py-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-mint text-sea">
            <BarChart3 size={20} aria-hidden />
          </span>
          <span>
            <span className="block text-lg font-bold">PlanShift</span>
            <span className="block text-xs text-slate-300">Pricing simulator</span>
          </span>
        </Link>
        <div className="mb-5 rounded-md border border-white/10 bg-white/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Active scenario</p>
          <p className="mt-2 text-sm font-semibold">SSO and audit logs migration</p>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div className="h-2 w-[68%] rounded-full bg-mint" />
          </div>
        </div>
        <nav className="space-y-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white">
              <item.icon size={17} aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 rounded-md border border-white/10 bg-white/5 p-3">
          <p className="text-sm font-semibold">Migration readiness</p>
          <p className="mt-1 text-xs leading-5 text-slate-300">High-risk accounts need CS outreach before launch.</p>
        </div>
      </aside>
      <main className="lg:pl-72">
        <div className="sticky top-0 z-20 border-b border-white/70 bg-white/85 px-4 py-3 backdrop-blur lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-md border border-line bg-white px-3 py-2 text-sm text-slate-500 shadow-panel md:flex">
              <Search size={16} aria-hidden />
              <span>Search customers, features, segments, or scenarios</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex size-10 items-center justify-center rounded-md border border-line bg-white text-slate-600 shadow-panel" aria-label="Notifications">
                <Bell size={17} aria-hidden />
              </button>
              <div className="hidden text-right text-sm md:block">
                <p className="font-semibold text-ink">Demo PM</p>
                <p className="text-xs text-slate-500">Product Manager</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-md bg-sea text-sm font-bold text-white">PM</div>
            </div>
          </div>
        </div>
        <div className="border-b border-line bg-white px-4 py-3 lg:hidden">
          <Link href="/dashboard" className="font-bold text-ink">PlanShift</Link>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

export function MetricCard({ label, value, detail, tone = "neutral", icon }: { label: string; value: string; detail?: string; tone?: "neutral" | "good" | "warn" | "bad"; icon?: React.ReactNode }) {
  return (
    <Card className="relative overflow-hidden">
      <div className={clsx("absolute inset-x-0 top-0 h-1", {
        "bg-slate-300": tone === "neutral",
        "bg-emerald-500": tone === "good",
        "bg-amber-500": tone === "warn",
        "bg-red-500": tone === "bad"
      })} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-ink">{value}</p>
        </div>
        {icon ? <div className="flex size-10 items-center justify-center rounded-md bg-slate-50 text-sea">{icon}</div> : <Badge tone={tone}>{tone === "neutral" ? "Live" : tone}</Badge>}
      </div>
      {detail ? <p className="mt-1 text-xs text-slate-500">{detail}</p> : null}
    </Card>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border-dashed text-center">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </Card>
  );
}

export function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  );
}

export function Meter({ value, tone = "neutral" }: { value: number; tone?: "neutral" | "good" | "warn" | "bad" }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className={clsx("h-full rounded-full", {
          "bg-slate-400": tone === "neutral",
          "bg-sea": tone === "good",
          "bg-gold": tone === "warn",
          "bg-coral": tone === "bad"
        })}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function PanelTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {description ? <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p> : null}
    </div>
  );
}

export function riskTone(score: number): "good" | "warn" | "bad" {
  if (score >= 70) return "bad";
  if (score >= 40) return "warn";
  return "good";
}
