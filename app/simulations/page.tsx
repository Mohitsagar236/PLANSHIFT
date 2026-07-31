import Link from "next/link";
import { Card, PageHeader, Shell, Badge } from "@/components/ui";
import { demoResult, demoScenario } from "@/lib/demo/data";

export default function SimulationsPage() {
  return (
    <Shell>
      <PageHeader title="Simulations" description="Create, run, and compare pricing and packaging change scenarios." action={<Link href="/simulations/new" className="rounded-md bg-sea px-4 py-2 text-sm font-semibold text-white">New scenario</Link>} />
      <Card>
        <div className="rounded-md border border-line p-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="font-semibold">{demoScenario.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{demoScenario.description}</p>
            </div>
            <Badge tone="good">Run</Badge>
          </div>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
            <span>Affected: {demoResult.affectedCustomersCount}</span><span>High risk: {demoResult.highRiskCustomersCount}</span><span>ARR uplift: ${demoResult.estimatedRevenueUplift.toLocaleString()}</span><span>Readiness: {demoResult.migrationReadinessScore}/100</span>
          </div>
          <div className="mt-4 flex gap-3"><Link className="text-sm font-semibold text-sea" href="/simulations/scenario-sso-audit-pro-to-enterprise/results">View results</Link><Link className="text-sm font-semibold text-sea" href="/simulations/scenario-sso-audit-pro-to-enterprise/report">Open report</Link></div>
        </div>
      </Card>
    </Shell>
  );
}
