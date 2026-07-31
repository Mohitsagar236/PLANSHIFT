import { Badge, Card, PageHeader, Shell, riskTone } from "@/components/ui";
import { demoResult } from "@/lib/demo/data";

export default function StrategyComparisonPage() {
  return (
    <Shell>
      <PageHeader title="Strategy comparison" description="Compare immediate migration, phased migration, grandfathering, add-ons, and discount strategies side by side." />
      <Card>
        <div className="overflow-x-auto rounded-md border border-line">
          <table className="table-surface w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="px-3 py-3">Strategy</th><th className="px-3 py-3">Estimated ARR</th><th className="px-3 py-3">ARR uplift</th><th className="px-3 py-3">Revenue at risk</th><th className="px-3 py-3">Affected</th><th className="px-3 py-3">High risk</th><th className="px-3 py-3">Grandfathered</th><th className="px-3 py-3">Support risk</th><th className="px-3 py-3">Complexity</th><th className="px-3 py-3">Score</th></tr></thead>
            <tbody>{demoResult.strategies.map((strategy) => <tr key={strategy.strategyName} className="border-t border-line"><td className="px-3 py-3 font-medium">{strategy.strategyName}</td><td className="px-3 py-3">${strategy.estimatedArr.toLocaleString()}</td><td className="px-3 py-3">${strategy.arrUplift.toLocaleString()}</td><td className="px-3 py-3">${strategy.revenueAtRisk.toLocaleString()}</td><td className="px-3 py-3">{strategy.affectedCustomersCount}</td><td className="px-3 py-3">{strategy.highRiskCustomersCount}</td><td className="px-3 py-3">{strategy.grandfatheredCustomersCount}</td><td className="px-3 py-3">{Math.round(strategy.highRiskCustomersCount * 1.4)}</td><td className="px-3 py-3">{strategy.executionComplexity}/100</td><td className="px-3 py-3"><Badge tone={riskTone(100 - strategy.recommendedScore)}>{strategy.recommendedScore}</Badge></td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </Shell>
  );
}
