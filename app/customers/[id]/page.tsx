import Link from "next/link";
import { Badge, Card, PageHeader, Shell, riskTone } from "@/components/ui";
import { customers, demoResult } from "@/lib/demo/data";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = customers.find((item) => item.id === id) ?? customers[0];
  const impact = demoResult.impacts.find((item) => item.customerId === customer.id);
  return (
    <Shell>
      <PageHeader title={customer.companyName} description="Customer profile, contract constraints, feature usage, simulation impact history, and recommended action." action={<Link className="rounded-md bg-sea px-4 py-2 text-sm font-semibold text-white" href="/simulations/scenario-sso-audit-pro-to-enterprise/results">View simulation</Link>} />
      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <h2 className="font-semibold">Company profile</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <dt className="text-slate-500">Segment</dt><dd>{customer.segment}</dd>
            <dt className="text-slate-500">Region</dt><dd>{customer.region}</dd>
            <dt className="text-slate-500">Current plan</dt><dd>{customer.currentPlanName}</dd>
            <dt className="text-slate-500">ARR / MRR</dt><dd>${customer.arr.toLocaleString()} / ${customer.mrr.toLocaleString()}</dd>
            <dt className="text-slate-500">Health score</dt><dd>{customer.healthScore}</dd>
            <dt className="text-slate-500">Tickets 90d</dt><dd>{customer.supportTicketCountLast90Days}</dd>
            <dt className="text-slate-500">Renewal</dt><dd>{customer.renewalDate}</dd>
            <dt className="text-slate-500">CS owner</dt><dd>{customer.customerSuccessOwner}</dd>
          </dl>
        </Card>
        <Card>
          <h2 className="font-semibold">Recommended action</h2>
          {impact ? (
            <>
              <div className="mt-4 flex flex-wrap gap-2"><Badge tone={riskTone(impact.churnRiskScore)}>Churn {impact.churnRiskScore}</Badge><Badge tone={riskTone(impact.migrationDifficultyScore)}>Migration {impact.migrationDifficultyScore}</Badge><Badge tone={riskTone(impact.overallImpactScore)}>Overall {impact.overallImpactScore}</Badge></div>
              <p className="mt-4 text-lg font-semibold">{impact.recommendedAction}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{impact.explanation}</p>
            </>
          ) : <p className="mt-4 text-sm text-slate-600">No disruption detected for the current demo scenario.</p>}
        </Card>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold">Features used</h2>
          <div className="grid gap-2">
            {customer.featureUsage.map((usage) => <div key={usage.featureKey} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm"><span>{usage.featureName}</span><Badge tone={usage.isBusinessCritical ? "warn" : "neutral"}>{usage.usageCountLast90Days} uses</Badge></div>)}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Contract restrictions</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{customer.contract?.customTerms}</p>
          <p className="mt-4 text-sm">Can change price before renewal: <span className="font-semibold">{customer.contract?.canChangePriceBeforeRenewal ? "Yes" : "No"}</span></p>
          <p className="mt-2 text-sm">Discount: <span className="font-semibold">{customer.contract?.discountPercentage}%</span></p>
        </Card>
      </div>
    </Shell>
  );
}
