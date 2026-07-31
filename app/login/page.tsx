import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-4">
      <div className="w-full max-w-md">
        <AuthForm mode="login" />
        <p className="mt-4 text-center text-sm text-slate-600">
          New workspace? <Link href="/signup" className="font-semibold text-sea">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
