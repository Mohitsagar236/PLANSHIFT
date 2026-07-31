import { RotateCcw, Save } from "lucide-react";
import { Button, Card, FieldLabel, Meter, PageHeader, PanelTitle, Shell } from "@/components/ui";
import { defaultRiskWeights } from "@/lib/simulation/risk-settings";

const labels: Record<keyof typeof defaultRiskWeights, string> = {
  healthScoreWeight: "Health score",
  supportTicketsWeight: "Support tickets",
  featureLossWeight: "Feature loss",
  businessCriticalFeatureWeight: "Critical feature loss",
  priceIncreaseWeight: "Price increase",
  renewalProximityWeight: "Renewal proximity",
  contractRestrictionWeight: "Contract restrictions",
  enterpriseSegmentWeight: "Enterprise segment",
  arrImpactWeight: "ARR impact",
  featureUsageWeight: "Feature usage"
};

export default function SettingsPage() {
  return (
    <Shell>
      <PageHeader title="Settings" description="Configure organization profile, default migration assumptions, segment definitions, demo data reload, user profile, and risk model weights." />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <PanelTitle title="Risk weights" description="Adjust how strongly each factor contributes to churn and migration risk scoring." />
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(defaultRiskWeights).map(([key, value]) => (
              <label key={key} className="rounded-md border border-line bg-slate-50 p-3 text-sm font-medium text-slate-700">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span>{labels[key as keyof typeof defaultRiskWeights]}</span>
                  <span className="rounded bg-white px-2 py-1 text-xs font-semibold text-sea ring-1 ring-line">{value}</span>
                </div>
                <input type="range" min={0} max={100} defaultValue={value} className="w-full accent-sea" />
                <div className="mt-2"><Meter value={value} tone={value > 15 ? "warn" : "good"} /></div>
              </label>
            ))}
          </div>
          <div className="mt-5 flex gap-2"><Button><Save size={16} aria-hidden /> Save weights</Button><Button className="bg-ink hover:bg-slate-700"><RotateCcw size={16} aria-hidden /> Reset defaults</Button></div>
        </Card>
        <Card>
          <PanelTitle title="Organization" description="Default workspace assumptions for new pricing simulations." />
          <div className="mb-4 grid gap-3">
            <div className="rounded-md bg-mint/50 p-3"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-sea">North star</p><p className="mt-1 text-sm text-slate-700">Affected customers migrated without churn or escalation.</p></div>
            <div className="rounded-md bg-slate-50 p-3"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Segments</p><p className="mt-1 text-sm text-slate-700">SMB, Mid-Market, Enterprise</p></div>
          </div>
          <FieldLabel label="Workspace name"><input defaultValue="PlanShift Demo Workspace" className="w-full rounded-md border border-line px-3 py-2" /></FieldLabel>
          <div className="mt-4">
            <FieldLabel label="Default migration assumption"><textarea defaultValue="Use phased migration for security feature packaging changes." className="min-h-24 w-full rounded-md border border-line px-3 py-2" /></FieldLabel>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2"><Button>Reload demo</Button><Button className="bg-coral hover:bg-[#A93430]">Reset data</Button></div>
        </Card>
      </div>
    </Shell>
  );
}
