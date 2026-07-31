import { Card, PageHeader, Shell } from "@/components/ui";

const sections = [
  ["Problem statement", "SaaS teams change pricing and packaging with incomplete visibility into customer disruption, feature dependency, contract restrictions, renewal timing, and churn risk."],
  ["Target users", "SaaS Product Managers, Growth PMs, Monetization PMs, founders, Revenue Operations leaders, and Customer Success leaders."],
  ["User personas", "Monetization PM evaluating plan changes, CS leader planning outreach, founder balancing ARR uplift against churn, and RevOps owner validating contract constraints."],
  ["Jobs-to-be-Done", "When planning a pricing change, help me predict revenue and customer impact so I can choose a migration strategy with confidence."],
  ["Product hypothesis", "If PMs can simulate feature loss, price deltas, churn risk, and grandfathering before launch, they will choose better migrations and reduce churn escalations."],
  ["MVP scope", "Auth, workspace, demo data, imports, customers, plans, features, scenario builder, simulation engine, risk settings, strategy comparison, report generator, and dashboard."],
  ["Non-goals", "Payment collection, invoice generation, subscription provisioning, and production billing-system synchronization."],
  ["Product metrics", "North star: percentage of affected customers migrated without churn or escalation. Supporting metrics include ARR uplift, high-risk accounts, feature-loss count, readiness score, and strategy confidence."],
  ["Prioritization framework", "Prioritized high-signal PM workflows first: identify affected accounts, quantify disruption, score risk, compare strategies, and generate a decision-ready report."],
  ["Key decisions and trade-offs", "The MVP uses explainable scoring over opaque ML, synthetic demo data over real customer data, and focused imports over deep billing integrations."],
  ["Risk model explanation", "Scores combine health, support burden, feature loss, business-critical dependency, price delta, renewal proximity, contract restrictions, segment impact, ARR, and feature usage."],
  ["Example simulation", "Move SSO and Advanced Audit Logs from Pro to Enterprise. Pro customers using security features become migration candidates; high-risk enterprise and near-renewal accounts receive grandfathering recommendations."],
  ["Roadmap", "Billing integrations, collaborative approvals, Salesforce/HubSpot sync, saved what-if variants, cohort analytics, experiment tracking, and post-launch migration health."],
  ["Go-to-market", "Lead with PM portfolio use case, then sell to B2B SaaS product and RevOps teams planning packaging migrations."],
  ["PlanShift packaging", "Free demo workspace, Team plan for simulations/imports/reports, Enterprise plan for CRM/billing integrations and governance."],
  ["Learnings and limitations", "The hardest product choice is balancing revenue optimization with trust. The model is explainable but should be calibrated with historical churn and escalation data."]
];

export default function CaseStudyPage() {
  return (
    <Shell>
      <PageHeader title="PlanShift product case study" description="A portfolio-ready explanation of the product thinking behind the pricing and packaging simulation MVP." />
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map(([title, copy]) => <Card key={title}><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p></Card>)}
      </div>
    </Shell>
  );
}
