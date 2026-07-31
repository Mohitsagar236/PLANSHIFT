"use client";

import { useState } from "react";
import { BarChart3, CheckCircle2, LogIn, UserPlus } from "lucide-react";
import { Button, Card } from "@/components/ui";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setError("");
    const payload =
      mode === "login"
        ? { email: formData.get("email"), password: formData.get("password") }
        : {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            organizationName: formData.get("organizationName"),
            role: "PRODUCT_MANAGER"
          };
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "Authentication failed");
      return;
    }
    window.location.href = data.redirectTo ?? "/dashboard";
  }

  return (
    <Card className="w-full max-w-md p-0 shadow-lift">
      <div className="rounded-t-md bg-[#111A1F] p-6 text-white">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-mint text-sea"><BarChart3 size={20} aria-hidden /></span>
          <div>
            <p className="text-lg font-semibold">PlanShift</p>
            <p className="text-xs text-slate-300">Pricing migration simulator</p>
          </div>
        </div>
        <h1 className="mt-6 text-2xl font-semibold">{mode === "login" ? "Log in to your pricing workspace" : "Create your pricing workspace"}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">Simulate plan changes, feature loss, churn risk, and migration strategy before customers feel the impact.</p>
      </div>
      <div className="p-6">
      <div className="mb-5 grid gap-2 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
        <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-sea" aria-hidden /> Demo account prefilled</div>
        <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-sea" aria-hidden /> Synthetic SaaS customer data only</div>
      </div>
      <form action={submit} className="mt-6 space-y-4">
        {mode === "signup" ? (
          <>
            <label className="block text-sm font-medium text-slate-700">
              Name
              <input name="name" required className="mt-1 w-full rounded-md border border-line px-3 py-2" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Organization
              <input name="organizationName" required className="mt-1 w-full rounded-md border border-line px-3 py-2" />
            </label>
          </>
        ) : null}
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input name="email" type="email" required defaultValue={mode === "login" ? "pm@planshift.dev" : ""} className="mt-1 w-full rounded-md border border-line px-3 py-2" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input name="password" type="password" required defaultValue={mode === "login" ? "PlanShift123!" : ""} className="mt-1 w-full rounded-md border border-line px-3 py-2" />
        </label>
        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <Button disabled={loading} className="w-full">
          {mode === "login" ? <LogIn size={17} aria-hidden /> : <UserPlus size={17} aria-hidden />}
          {loading ? "Working..." : mode === "login" ? "Log in" : "Sign up"}
        </Button>
      </form>
      </div>
    </Card>
  );
}
