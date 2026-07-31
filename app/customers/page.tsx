import Link from "next/link";
import { Search } from "lucide-react";
import { Badge, Card, PageHeader, Shell, riskTone } from "@/components/ui";
import { customers, demoResult } from "@/lib/demo/data";

const riskByCustomer = new Map(demoResult.impacts.map((impact) => [impact.customerId, impact]));

export default function CustomersPage() {
  return (
    <Shell>
      <PageHeader title="Customers" description="Search, filter, and inspect accounts affected by pricing and packaging changes." />
      <Card>
        <div className="mb-4 grid gap-3 md:grid-cols-5">
          <label className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} aria-hidden />
            <input aria-label="Search customers" placeholder="Search customers" className="w-full rounded-md border border-line py-2 pl-9 pr-3" />
          </label>
          <select aria-label="Filter by plan" className="rounded-md border border-line px-3 py-2"><option>All plans</option><option>Pro</option><option>Enterprise</option></select>
          <select aria-label="Filter by segment" className="rounded-md border border-line px-3 py-2"><option>All segments</option><option>SMB</option><option>Mid-Market</option><option>Enterprise</option></select>
          <select aria-label="Filter by risk" className="rounded-md border border-line px-3 py-2"><option>All risks</option><option>High risk</option><option>Near renewal</option></select>
        </div>
        <div className="overflow-x-auto rounded-md border border-line">
          <table className="table-surface w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="px-3 py-3">Company</th><th className="px-3 py-3">Segment</th><th className="px-3 py-3">Region</th><th className="px-3 py-3">Plan</th><th className="px-3 py-3">ARR</th><th className="px-3 py-3">Renewal</th><th className="px-3 py-3">Risk</th><th className="px-3 py-3">Action</th></tr></thead>
            <tbody>
              {customers.slice(0, 80).map((customer) => {
                const impact = riskByCustomer.get(customer.id);
                return (
                  <tr key={customer.id} className="border-t border-line">
                    <td className="px-3 py-3 font-medium"><Link href={`/customers/${customer.id}`} className="text-sea">{customer.companyName}</Link><p className="text-xs font-normal text-slate-500">{customer.customerSuccessOwner}</p></td>
                    <td className="px-3 py-3">{customer.segment}</td><td className="px-3 py-3">{customer.region}</td><td className="px-3 py-3">{customer.currentPlanName}</td><td className="px-3 py-3">${customer.arr.toLocaleString()}</td><td className="px-3 py-3">{customer.renewalDate}</td>
                    <td className="px-3 py-3">{impact ? <Badge tone={riskTone(impact.churnRiskScore)}>{impact.churnRiskScore}</Badge> : <Badge tone="good">N/A</Badge>}</td>
                    <td className="px-3 py-3">{impact?.recommendedAction ?? "No action"}</td>
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
