import Link from "next/link";
import { ArrowRight, CheckCircle2, Gauge, GitCompare, ShieldAlert, Sparkles, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { demoResult } from "@/lib/demo/data";

const previewMetrics: Array<[string, string | number, LucideIcon]> = [
  ["ARR uplift", `$${Math.round(demoResult.estimatedRevenueUplift / 1000)}K`, TrendingUp],
  ["Affected customers", demoResult.affectedCustomersCount, Users],
  ["High-risk accounts", demoResult.highRiskCustomersCount, ShieldAlert],
  ["Readiness score", `${demoResult.migrationReadinessScore}/100`, Gauge]
];

export default function LandingPage() {
  return (
    <main className="overflow-hidden bg-paper text-ink">
      <section className="relative mx-auto grid min-h-[86vh] max-w-7xl items-center gap-10 px-4 py-10 md:grid-cols-[1.02fr_0.98fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sea/20 bg-white px-3 py-1 text-sm font-semibold text-sea shadow-panel">
            <Sparkles size={15} aria-hidden /> PM portfolio-grade SaaS MVP
          </div>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-normal md:text-7xl">PlanShift</h1>
          <p className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-slate-800 md:text-5xl">Simulate pricing and packaging changes before they impact customers.</p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            PlanShift helps SaaS teams compare revenue impact, feature-loss disruption, churn risk, grandfathering options, and migration strategies before launching pricing changes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-sea px-5 py-3 text-sm font-semibold text-white">
              Try demo <ArrowRight size={17} aria-hidden />
            </Link>
            <Link href="/case-study" className="inline-flex min-h-11 items-center rounded-md border border-line bg-white px-5 py-3 text-sm font-semibold text-ink">
              Read case study
            </Link>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {["Monetization", "Segmentation", "Migration planning"].map((item) => <Badge key={item} tone="neutral">{item}</Badge>)}
          </div>
        </div>
        <div className="rounded-md border border-white/80 bg-white p-5 shadow-lift ring-1 ring-slate-900/5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Scenario preview</p>
              <h2 className="mt-1 text-xl font-semibold">SSO and audit logs migration</h2>
            </div>
            <Badge tone="warn">Decision needed</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {previewMetrics.map(([label, value, Icon]) => (
              <div key={label} className="rounded-md border border-line bg-slate-50 p-4">
                <Icon className="text-sea" size={18} aria-hidden />
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-md border border-line bg-[#FBFCFC] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold"><GitCompare size={16} aria-hidden /> Best migration strategy</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{demoResult.recommendation}</p>
          </div>
        </div>
      </section>
      <section className="border-t border-line bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 md:grid-cols-3">
          {[
            ["The problem", "Pricing changes fail when teams cannot see which customers lose critical value, face contract restrictions, or need CS outreach."],
            ["How it works", "Import customer, plan, feature usage, and contract data. Build a scenario. Run a risk-weighted simulation and compare strategies."],
            ["Who it is for", "Product, Growth, Monetization, RevOps, Customer Success, and founders planning B2B SaaS migrations."]
          ].map(([title, copy]) => (
            <Card key={title}>
              <CheckCircle2 className="text-sea" size={20} aria-hidden />
              <h2 className="mt-4 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
