"use client";

import { useState } from "react";
import { FileCheck2, RotateCcw, Upload } from "lucide-react";
import { Badge, Button, Card, Meter, PanelTitle } from "@/components/ui";
import type { CsvType, CsvValidationResult } from "@/lib/csv/validators";

const types: CsvType[] = ["customers", "current_plans", "proposed_plans", "feature_usage", "contracts"];

export function ImportWorkbench() {
  const [type, setType] = useState<CsvType>("customers");
  const [result, setResult] = useState<CsvValidationResult | null>(null);
  const [message, setMessage] = useState("");

  async function validate(file?: File) {
    if (!file) return;
    setMessage("Validating CSV...");
    const response = await fetch("/api/imports/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, csvText: await file.text() })
    });
    const data = await response.json();
    setResult(data);
    setMessage(response.ok ? "Preview ready" : data.error ?? "Validation failed");
  }

  const quality = result ? Math.round((result.validRows.length / Math.max(result.totalRows, 1)) * 100) : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <PanelTitle title="CSV upload" description="Choose a dataset, preview rows, and validate structure before import." />
        <label className="block text-sm font-medium text-slate-700">
          Dataset type
          <select value={type} onChange={(event) => setType(event.target.value as CsvType)} className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2">
            {types.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="mt-4 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-sea/30 bg-mint/40 px-4 py-6 text-center transition hover:bg-mint/60">
          <Upload className="text-sea" aria-hidden />
          <span className="mt-2 text-sm font-semibold">Choose CSV</span>
          <span className="mt-1 text-xs text-slate-500">Sample files are available in /sample-data.</span>
          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => validate(event.target.files?.[0])} />
        </label>
        {message ? <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">{message}</p> : null}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button type="button" onClick={() => setMessage("Demo data reload queued. Run npm.cmd run db:seed for a database reload.")}><RotateCcw size={16} aria-hidden /> Reload demo</Button>
          <Button type="button" className="bg-coral hover:bg-[#A93430]" onClick={() => setMessage("Imported data reset queued. Run npm.cmd run db:reset-demo for a database reset.")}>Reset data</Button>
        </div>
      </Card>
      <Card>
        <div className="flex items-start justify-between gap-3">
          <PanelTitle title="Preview and validation" description="Column checks and row-level errors are shown before data is accepted." />
          {result ? <Badge tone={result.errors.length ? "bad" : "good"}>{result.errors.length ? `${result.errors.length} errors` : "Valid"}</Badge> : null}
        </div>
        {result ? (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-slate-50 p-3"><p className="text-xs text-slate-500">Total rows</p><p className="mt-1 text-2xl font-semibold">{result.totalRows}</p></div>
              <div className="rounded-md bg-emerald-50 p-3"><p className="text-xs text-emerald-800">Valid rows</p><p className="mt-1 text-2xl font-semibold">{result.validRows.length}</p></div>
              <div className="rounded-md bg-amber-50 p-3"><p className="text-xs text-amber-800">Quality</p><p className="mt-1 text-2xl font-semibold">{quality}%</p></div>
            </div>
            <div className="mt-3"><Meter value={quality} tone={result.errors.length ? "warn" : "good"} /></div>
            <p className="mt-3 text-sm text-slate-600">Headers: {result.headers.join(", ")}</p>
            {result.errors.length ? (
              <div className="mt-4 max-h-72 overflow-auto rounded-md border border-line">
                <table className="table-surface w-full text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500"><tr><th className="px-3 py-3">Row</th><th className="px-3 py-3">Field</th><th className="px-3 py-3">Message</th></tr></thead>
                  <tbody>{result.errors.slice(0, 30).map((error, index) => <tr key={index} className="border-t border-line"><td className="px-3 py-3">{error.rowNumber}</td><td className="px-3 py-3">{error.field}</td><td className="px-3 py-3">{error.message}</td></tr>)}</tbody>
                </table>
              </div>
            ) : (
              <pre className="mt-4 max-h-72 overflow-auto rounded-md bg-slate-950 p-4 text-xs text-white">{JSON.stringify(result.validRows.slice(0, 5), null, 2)}</pre>
            )}
          </>
        ) : (
          <div className="rounded-md border border-dashed border-line bg-slate-50 p-8 text-center">
            <FileCheck2 className="mx-auto text-sea" aria-hidden />
            <p className="mt-3 font-semibold">No CSV selected</p>
            <p className="mt-1 text-sm text-slate-600">Upload a file to preview validated rows before confirming import.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
