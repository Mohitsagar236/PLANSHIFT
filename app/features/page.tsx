import { AlertTriangle, CheckCircle2, Search } from "lucide-react";
import { Badge, Card, Meter, PageHeader, PanelTitle, Shell } from "@/components/ui";
import { customers, features, plans } from "@/lib/demo/data";

export default function FeaturesPage() {
  return (
    <Shell>
      <PageHeader title="Features" description="Review feature criticality, plan availability, and customer dependency before packaging changes." />
      <Card className="mb-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <PanelTitle title="Feature dependency catalog" description="Security and compliance features should be reviewed before moving them between plans." />
          <label className="flex min-w-72 items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm text-slate-500">
            <Search size={16} aria-hidden />
            <input className="w-full border-0 bg-transparent outline-none" placeholder="Search feature catalog" />
          </label>
        </div>
        <div className="mt-1 grid gap-3 md:grid-cols-3">
          <div className="rounded-md bg-slate-50 p-3"><p className="text-xs text-slate-500">Total features</p><p className="mt-1 text-2xl font-semibold">{features.length}</p></div>
          <div className="rounded-md bg-amber-50 p-3"><p className="text-xs text-amber-800">Business critical</p><p className="mt-1 text-2xl font-semibold">{features.filter((feature) => feature.isBusinessCritical).length}</p></div>
          <div className="rounded-md bg-emerald-50 p-3"><p className="text-xs text-emerald-800">Mapped plans</p><p className="mt-1 text-2xl font-semibold">{plans.length}</p></div>
        </div>
      </Card>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => {
          const planNames = Array.from(new Set(plans.filter((plan) => plan.featureKeys.includes(feature.key)).map((plan) => plan.name)));
          const users = customers.filter((customer) => customer.featureUsage.some((usage) => usage.featureKey === feature.key)).length;
          const dependency = Math.round((users / customers.length) * 100);
          return (
            <Card key={feature.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md bg-slate-50 text-sea">
                    {feature.isBusinessCritical ? <AlertTriangle size={17} aria-hidden /> : <CheckCircle2 size={17} aria-hidden />}
                  </span>
                  <div>
                    <h2 className="font-semibold">{feature.name}</h2>
                    <p className="text-xs text-slate-500">{feature.key}</p>
                  </div>
                </div>
                <Badge tone={feature.isBusinessCritical ? "warn" : "neutral"}>{feature.category}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-xs text-slate-500"><span>Customer dependency</span><span>{dependency}%</span></div>
                <Meter value={dependency} tone={feature.isBusinessCritical ? "warn" : "good"} />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {planNames.slice(0, 6).map((plan) => <Badge key={plan}>{plan}</Badge>)}
              </div>
              <p className="mt-4 text-sm"><span className="font-semibold">{users}</span> customers use this feature</p>
            </Card>
          );
        })}
      </div>
    </Shell>
  );
}
