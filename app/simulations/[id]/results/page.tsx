import Link from "next/link";
import { CalendarClock, FileText, ShieldAlert, TrendingUp, Users } from "lucide-react";
import { Badge, Card, Meter, MetricCard, PageHeader, PanelTitle, Shell, riskTone } from "@/components/ui";
import { SimpleBarChart } from "@/components/charts";
import { demoResult } from "@/lib/demo/data";

export default function SimulationResultsPage() {
  const manualReviews = demoResult.impacts.filter((impact) => impact.recommendedAction === "Needs manual review").length;

  return (
    <Shell>
      <PageHeader
        title="Simulation results"
        description="Executive summary, financial impact, customer disruption, feature loss, segment analysis, strategy comparison, and recommended actions."
        action={<Link href="/simulations/scenario-sso-audit-pro-to-enterprise/report" className="rounded-md bg-sea px-4 py-2 text-sm font-semibold text-white">Open report</Link>}
      />
      <Card className="mb-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.42fr] lg:items-center">
          <div>
            <Badge tone={demoResult.highRiskCustomersCount > 30 ? "bad" : "warn"}>{demoResult.highRiskCustomersCount > 30 ? "High risk" : "Moderate risk"}</Badge>
            <h2 className="mt-3 text-2xl font-semibold text-ink">Recommended: phased migration with targeted grandfathering.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{demoResult.recommendation}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-md bg-slate-50 p-3"><p className="text-xs text-slate-500">Manual review queue</p><p className="mt-1 text-xl font-semibold">{manualReviews}</p></div>
              <div className="rounded-md bg-slate-50 p-3"><p className="text-xs text-slate-500">Near renewal</p><p className="mt-1 text-xl font-semibold">{demoResult.customersNearRenewal}</p></div>
              <div className="rounded-md bg-slate-50 p-3"><p className="text-xs text-slate-500">Blocked by contract</p><p className="mt-1 text-xl font-semibold">{demoResult.customersBlockedByContractTerms}</p></div>
            </div>
          </div>
          <div className="rounded-md border border-line bg-slate-50 p-4">
            <p className="text-sm font-semibold">Migration readiness</p>
            <p className="mt-2 text-4xl font-semibold text-ink">{demoResult.migrationReadinessScore}</p>
            <div className="mt-3"><Meter value={demoResult.migrationReadinessScore} tone={demoResult.migrationReadinessScore > 70 ? "good" : "warn"} /></div>
            <p className="mt-3 text-xs leading-5 text-slate-500">Improves as high-risk customers receive outreach, discounts, or temporary grandfathering.</p>
          </div>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Current ARR" value={`$${demoResult.currentArr.toLocaleString()}`} icon={<TrendingUp size={18} aria-hidden />} />
        <MetricCard label="Proposed ARR" value={`$${demoResult.proposedArr.toLocaleString()}`} tone="good" icon={<TrendingUp size={18} aria-hidden />} />
        <MetricCard label="Affected customers" value={String(demoResult.affectedCustomersCount)} tone="warn" icon={<Users size={18} aria-hidden />} />
        <MetricCard label="High-risk customers" value={String(demoResult.highRiskCustomersCount)} tone="bad" icon={<ShieldAlert size={18} aria-hidden />} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card><PanelTitle title="Financial impact" description="Revenue bridge across uplift, risk, discounts, and grandfathering." /><SimpleBarChart data={[{ name: "ARR delta", value: demoResult.arrDelta }, { name: "At risk", value: demoResult.revenueAtRisk }, { name: "Discount", value: demoResult.discountImpact }, { name: "Grandfather", value: demoResult.grandfatheringImpact }]} /></Card>
        <Card><PanelTitle title="Segment analysis" description="Affected accounts by segment for launch and communication planning." /><SimpleBarChart data={["SMB", "Mid-Market", "Enterprise"].map((segment) => ({ name: segment, value: demoResult.impacts.filter((impact) => impact.segment === segment).length }))} /></Card>
      </div>
      <Card className="mt-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <PanelTitle title="Customer impact queue" description="Prioritized customer list for Product, RevOps, and Customer Success." />
          <div className="flex flex-wrap gap-2">
            <Badge tone="bad"><ShieldAlert size={13} aria-hidden /> {demoResult.highRiskCustomersCount} high risk</Badge>
            <Badge tone="warn"><CalendarClock size={13} aria-hidden /> {demoResult.customersNearRenewal} near renewal</Badge>
          </div>
        </div>
        <div className="overflow-x-auto rounded-md border border-line">
          <table className="table-surface w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="px-3 py-3">Customer</th><th className="px-3 py-3">Segment</th><th className="px-3 py-3">Current</th><th className="px-3 py-3">Proposed</th><th className="px-3 py-3">ARR</th><th className="px-3 py-3">Renewal</th><th className="px-3 py-3">Feature loss</th><th className="px-3 py-3">Price delta</th><th className="px-3 py-3">Churn risk</th><th className="px-3 py-3">Action</th></tr></thead>
            <tbody>
              {demoResult.impacts.slice(0, 40).map((impact) => (
                <tr key={impact.customerId} className="border-t border-line">
                  <td className="px-3 py-3 font-medium">{impact.customerName}<p className="text-xs font-normal text-slate-500">{impact.lostFeatureNames.join(", ") || "No feature loss"}</p></td>
                  <td className="px-3 py-3">{impact.segment}</td>
                  <td className="px-3 py-3">{impact.currentPlan}</td>
                  <td className="px-3 py-3">{impact.proposedPlan}</td>
                  <td className="px-3 py-3">${impact.arr.toLocaleString()}</td>
                  <td className="px-3 py-3">{impact.renewalDate}</td>
                  <td className="px-3 py-3">{impact.featureLossCount}</td>
                  <td className="px-3 py-3">${impact.annualPriceDelta.toLocaleString()}</td>
                  <td className="px-3 py-3"><Badge tone={riskTone(impact.churnRiskScore)}>{impact.churnRiskScore}</Badge></td>
                  <td className="px-3 py-3">{impact.recommendedAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <Link href="/simulations/scenario-sso-audit-pro-to-enterprise/report" className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink shadow-panel"><FileText size={16} aria-hidden /> View impact report</Link>
        </div>
      </Card>
    </Shell>
  );
}
