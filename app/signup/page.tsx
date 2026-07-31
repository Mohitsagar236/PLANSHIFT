import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-4">
      <div className="w-full max-w-md">
        <AuthForm mode="signup" />
        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account? <Link href="/login" className="font-semibold text-sea">Log in</Link>
        </p>
      </div>
    </main>
  );
}
