import { ArrowRight, Layers3, Plus } from "lucide-react";
import { Badge, Button, Card, Meter, PageHeader, PanelTitle, Shell } from "@/components/ui";
import { currentPlans, proposedPlans } from "@/lib/demo/data";

export default function PlansPage() {
  return (
    <Shell>
      <PageHeader
        title="Plans"
        description="Compare current and proposed packaging, pricing, support levels, and feature continuity."
        action={<Button><Plus size={16} aria-hidden /> New plan</Button>}
      />
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm font-medium text-slate-500">Current catalog</p>
          <p className="mt-2 text-3xl font-semibold">{currentPlans.length}</p>
          <p className="mt-1 text-xs text-slate-500">Plans in production</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-slate-500">Proposed catalog</p>
          <p className="mt-2 text-3xl font-semibold">{proposedPlans.length}</p>
          <p className="mt-1 text-xs text-slate-500">Plans under review</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-slate-500">Security move</p>
          <p className="mt-2 text-3xl font-semibold">2</p>
          <p className="mt-1 text-xs text-slate-500">Critical features moving upward</p>
        </Card>
      </div>
      <Card>
        <PanelTitle title="Plan migration map" description="Each row compares the current package with its proposed successor and highlights pricing and feature continuity." />
        <div className="overflow-x-auto rounded-md border border-line">
          <table className="table-surface w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Current</th>
                <th className="px-3 py-3">Proposed</th>
                <th className="px-3 py-3">Monthly price</th>
                <th className="px-3 py-3">Support</th>
                <th className="px-3 py-3">Feature continuity</th>
                <th className="px-3 py-3">Included features</th>
              </tr>
            </thead>
            <tbody>
              {currentPlans.map((plan, index) => {
                const proposed = proposedPlans[index] ?? proposedPlans[0];
                const overlap = proposed.featureKeys.filter((feature) => plan.featureKeys.includes(feature)).length;
                const continuity = Math.round((overlap / Math.max(plan.featureKeys.length, 1)) * 100);
                return (
                  <tr key={plan.id} className="border-t border-line">
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2 font-semibold"><Layers3 size={16} className="text-sea" aria-hidden /> {plan.name}</div>
                      <p className="mt-1 text-xs text-slate-500">${plan.annualPrice}/yr</p>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2 font-semibold"><ArrowRight size={14} className="text-slate-400" aria-hidden /> {proposed.name}</div>
                      <p className="mt-1 text-xs text-slate-500">${proposed.annualPrice}/yr</p>
                    </td>
                    <td className="px-3 py-4">
                      <span className="font-semibold">${plan.monthlyPrice}</span>
                      <span className="mx-2 text-slate-400">to</span>
                      <span className="font-semibold text-sea">${proposed.monthlyPrice}</span>
                    </td>
                    <td className="px-3 py-4"><Badge>{proposed.supportLevel}</Badge></td>
                    <td className="px-3 py-4">
                      <div className="min-w-36">
                        <div className="mb-2 flex justify-between text-xs text-slate-500"><span>Coverage</span><span>{continuity}%</span></div>
                        <Meter value={continuity} tone={continuity > 80 ? "good" : continuity > 60 ? "warn" : "bad"} />
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex max-w-md flex-wrap gap-1.5">
                        {proposed.featureKeys.slice(0, 6).map((feature) => <Badge key={feature} tone={plan.featureKeys.includes(feature) ? "good" : "warn"}>{feature}</Badge>)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </Shell>
  );
}
