import { AlertTriangle, CalendarClock, DollarSign, Gauge, ShieldAlert, Sparkles, TrendingUp, Users } from "lucide-react";
import { Card, MetricCard, PageHeader, Shell, Badge, riskTone } from "@/components/ui";
import { SimpleBarChart, SimplePieChart } from "@/components/charts";
import { customers, demoResult } from "@/lib/demo/data";
import { featureLossImpact, planDistribution, riskDistribution, segmentCounts } from "@/lib/demo/metrics";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function DashboardPage() {
  const nearRenewal = demoResult.customersNearRenewal;
  const topRisk = demoResult.impacts.slice(0, 6);
  return (
    <Shell>
      <PageHeader
        title="Pricing change command center"
        description="Monitor the expected revenue, customer disruption, feature-loss, and migration readiness impact of the seeded SSO and audit-log packaging change."
      />
      <Card className="mb-6 overflow-hidden bg-[#111A1F] p-0 text-white shadow-lift">
        <div className="grid gap-0 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-mint">
              <Sparkles size={14} aria-hidden /> Executive decision brief
            </div>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold md:text-4xl">Move SSO and Advanced Audit Logs from Pro to Enterprise.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              The model projects meaningful ARR upside, but the migration should be phased because security feature loss concentrates risk among Pro accounts with low health, high usage, contract restrictions, and renewals inside 60 days.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-white/10 bg-white/5 p-4"><p className="text-xs text-slate-400">Recommended strategy</p><p className="mt-2 font-semibold">6-month phased migration</p></div>
              <div className="rounded-md border border-white/10 bg-white/5 p-4"><p className="text-xs text-slate-400">Primary guardrail</p><p className="mt-2 font-semibold">Grandfather high-risk accounts</p></div>
              <div className="rounded-md border border-white/10 bg-white/5 p-4"><p className="text-xs text-slate-400">Next owner</p><p className="mt-2 font-semibold">Customer Success</p></div>
            </div>
          </div>
          <div className="border-t border-white/10 bg-white/5 p-6 lg:border-l lg:border-t-0">
            <p className="text-sm font-semibold text-slate-300">Migration readiness</p>
            <div className="mt-5 flex aspect-square max-w-56 items-center justify-center rounded-full border-[18px] border-mint/80 bg-white/10">
              <span className="text-5xl font-semibold">{demoResult.migrationReadinessScore}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">Score improves when high-risk enterprise and near-renewal accounts are grandfathered or given CS-led outreach.</p>
          </div>
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total customers" value={String(customers.length)} icon={<Users size={18} aria-hidden />} />
        <MetricCard label="Current ARR" value={money.format(demoResult.currentArr)} icon={<DollarSign size={18} aria-hidden />} />
        <MetricCard label="Proposed ARR" value={money.format(demoResult.proposedArr)} tone="good" icon={<TrendingUp size={18} aria-hidden />} />
        <MetricCard label="ARR uplift" value={money.format(demoResult.estimatedRevenueUplift)} tone="good" icon={<TrendingUp size={18} aria-hidden />} />
        <MetricCard label="Affected customers" value={String(demoResult.affectedCustomersCount)} tone="warn" icon={<AlertTriangle size={18} aria-hidden />} />
        <MetricCard label="High-risk customers" value={String(demoResult.highRiskCustomersCount)} tone="bad" icon={<ShieldAlert size={18} aria-hidden />} />
        <MetricCard label="Critical feature loss" value={String(demoResult.customersLosingFeatureAccess)} tone="warn" icon={<ShieldAlert size={18} aria-hidden />} />
        <MetricCard label="Near renewal" value={String(nearRenewal)} tone="warn" icon={<CalendarClock size={18} aria-hidden />} />
        <MetricCard label="Grandfather candidates" value={String(demoResult.impacts.filter((i) => i.recommendedAction.includes("Grandfather")).length)} icon={<Users size={18} aria-hidden />} />
        <MetricCard label="Readiness score" value={`${demoResult.migrationReadinessScore}/100`} tone={demoResult.migrationReadinessScore > 65 ? "good" : "warn"} icon={<Gauge size={18} aria-hidden />} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card><h2 className="mb-4 font-semibold">Current ARR vs proposed ARR</h2><SimpleBarChart data={[{ name: "Current", value: demoResult.currentArr }, { name: "Proposed", value: demoResult.proposedArr }]} /></Card>
        <Card><h2 className="mb-4 font-semibold">Customers affected by segment</h2><SimpleBarChart data={segmentCounts()} /></Card>
        <Card><h2 className="mb-4 font-semibold">Risk distribution</h2><SimplePieChart data={riskDistribution()} /></Card>
        <Card><h2 className="mb-4 font-semibold">Feature-loss impact</h2><SimpleBarChart data={featureLossImpact()} /></Card>
        <Card><h2 className="mb-4 font-semibold">Current plan distribution</h2><SimplePieChart data={planDistribution("current")} /></Card>
        <Card><h2 className="mb-4 font-semibold">Proposed migration distribution</h2><SimplePieChart data={planDistribution("proposed")} /></Card>
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h2 className="mb-4 font-semibold">Top high-risk accounts</h2>
          <div className="overflow-x-auto">
            <table className="table-surface w-full overflow-hidden rounded-md text-left text-sm">
              <thead className="text-xs uppercase text-slate-500"><tr><th className="px-3 py-3">Customer</th><th className="px-3 py-3">Segment</th><th className="px-3 py-3">Risk</th><th className="px-3 py-3">Action</th></tr></thead>
              <tbody>
                {topRisk.map((impact) => (
                  <tr key={impact.customerId} className="border-t border-line"><td className="px-3 py-3 font-medium">{impact.customerName}</td><td className="px-3 py-3">{impact.segment}</td><td className="px-3 py-3"><Badge tone={riskTone(impact.churnRiskScore)}>{impact.churnRiskScore}</Badge></td><td className="px-3 py-3">{impact.recommendedAction}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Decision recommendation</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{demoResult.recommendation}</p>
          <p className="mt-4 text-sm text-slate-600">Confidence score: <span className="font-semibold text-ink">{demoResult.strategyConfidenceScore}/100</span></p>
        </Card>
      </div>
    </Shell>
  );
}
