import Link from "next/link";
import { Card, PageHeader, Shell } from "@/components/ui";
import { currentPlans, features } from "@/lib/demo/data";

export default function NewSimulationPage() {
  return (
    <Shell>
      <PageHeader title="Scenario builder" description="Define pricing change type, affected plans, feature moves, migration timing, grandfathering rule, and discount strategy." />
      <Card>
        <form className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium">Scenario name<input className="mt-1 w-full rounded-md border border-line px-3 py-2" defaultValue="Move SSO and Advanced Audit Logs from Pro to Enterprise" /></label>
          <label className="text-sm font-medium">Pricing change type<select className="mt-1 w-full rounded-md border border-line px-3 py-2"><option>Move feature to higher plan</option><option>Increase plan price</option><option>Create add-on</option><option>Custom migration rule</option></select></label>
          <label className="text-sm font-medium">Affected current plans<select className="mt-1 w-full rounded-md border border-line px-3 py-2" defaultValue="Pro">{currentPlans.map((plan) => <option key={plan.id}>{plan.name}</option>)}</select></label>
          <label className="text-sm font-medium">Proposed target plan<select className="mt-1 w-full rounded-md border border-line px-3 py-2" defaultValue="Business"><option>Business</option><option>Enterprise</option><option>Growth</option></select></label>
          <label className="text-sm font-medium">Affected features<select className="mt-1 w-full rounded-md border border-line px-3 py-2" defaultValue="SSO">{features.filter((feature) => feature.category === "Security").map((feature) => <option key={feature.id}>{feature.name}</option>)}</select></label>
          <label className="text-sm font-medium">Grandfathering rule<select className="mt-1 w-full rounded-md border border-line px-3 py-2"><option>Grandfather high-risk accounts</option><option>Grandfather customers near renewal</option><option>No grandfathering</option></select></label>
          <label className="text-sm font-medium">Migration start<input type="date" className="mt-1 w-full rounded-md border border-line px-3 py-2" defaultValue="2026-09-01" /></label>
          <label className="text-sm font-medium">Migration end<input type="date" className="mt-1 w-full rounded-md border border-line px-3 py-2" defaultValue="2027-03-01" /></label>
          <label className="md:col-span-2 text-sm font-medium">Notes<textarea className="mt-1 min-h-28 w-full rounded-md border border-line px-3 py-2" defaultValue="Use a phased migration and require Customer Success outreach for high-risk enterprise customers." /></label>
        </form>
        <Link href="/simulations/scenario-sso-audit-pro-to-enterprise/results" className="mt-6 inline-flex rounded-md bg-sea px-4 py-2 text-sm font-semibold text-white">Run simulation</Link>
      </Card>
    </Shell>
  );
}
