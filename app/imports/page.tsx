import { ImportWorkbench } from "@/components/import-workbench";
import { Card, PageHeader, Shell, Badge } from "@/components/ui";

export default function ImportsPage() {
  return (
    <Shell>
      <PageHeader title="Data import" description="Upload customers, plans, feature usage, and contract data with preview, column validation, row validation, and import history." />
      <ImportWorkbench />
      <Card className="mt-4">
        <h2 className="mb-4 font-semibold">Import history</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {["customers.csv", "current_plans.csv", "feature_usage.csv"].map((file, index) => <div key={file} className="rounded-md border border-line p-3 text-sm"><div className="flex justify-between"><span className="font-medium">{file}</span><Badge tone="good">Demo</Badge></div><p className="mt-2 text-slate-500">{250 + index * 600} rows imported successfully</p></div>)}
        </div>
      </Card>
    </Shell>
  );
}
