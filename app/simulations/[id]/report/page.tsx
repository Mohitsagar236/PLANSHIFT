import { Copy, Download, FileText, ShieldAlert, TrendingUp, Users } from "lucide-react";
import { Badge, Button, Card, MetricCard, PageHeader, PanelTitle, Shell } from "@/components/ui";
import { demoResult } from "@/lib/demo/data";

export default function ReportPage() {
  return (
    <Shell>
      <PageHeader title="Impact report" description="PM-ready pricing-change narrative covering objective, business impact, customer risk, strategy, metrics, and open questions." />
      <div className="mb-4 grid gap-4 md:grid-cols-4">
        <MetricCard label="ARR uplift" value={`$${demoResult.estimatedRevenueUplift.toLocaleString()}`} tone="good" icon={<TrendingUp size={18} aria-hidden />} />
        <MetricCard label="Affected customers" value={String(demoResult.affectedCustomersCount)} tone="warn" icon={<Users size={18} aria-hidden />} />
        <MetricCard label="High risk" value={String(demoResult.highRiskCustomersCount)} tone="bad" icon={<ShieldAlert size={18} aria-hidden />} />
        <MetricCard label="Readiness" value={`${demoResult.migrationReadinessScore}/100`} icon={<FileText size={18} aria-hidden />} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.32fr_0.68fr]">
        <Card className="h-fit">
          <PanelTitle title="Report outline" description="A stakeholder-ready structure for pricing council review." />
          <div className="space-y-2 text-sm">
            {["Executive summary", "Business objective", "Financial impact", "Customer impact", "Migration strategy", "Open questions"].map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-md bg-slate-50 px-3 py-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-sea ring-1 ring-line">{index + 1}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-md border border-line bg-mint/50 p-4">
            <p className="text-sm font-semibold">Decision recommendation</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{demoResult.recommendation}</p>
          </div>
        </Card>
        <Card className="p-0">
          <div className="flex flex-col justify-between gap-3 border-b border-line p-5 md:flex-row md:items-center">
            <div>
              <Badge tone="neutral">Markdown</Badge>
              <h2 className="mt-2 text-xl font-semibold">Pricing change impact report</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button><Copy size={16} aria-hidden /> Copy report</Button>
              <Button className="bg-ink hover:bg-slate-700"><Download size={16} aria-hidden /> Export Markdown</Button>
            </div>
          </div>
          <article className="max-w-none whitespace-pre-wrap p-6 text-sm leading-7 text-slate-700 md:p-8">{demoResult.reportMarkdown}</article>
        </Card>
      </div>
    </Shell>
  );
}
