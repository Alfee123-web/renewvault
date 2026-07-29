import { AuthShell } from "@/app/components/auth/auth-shell";
import { AuthCard } from "@/app/components/auth/auth-card";
import { SignInForm } from "@/app/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <AuthShell>
      <AuthCard>
        <h2 className="text-2xl font-semibold">Sign in</h2>
        <p className="mt-2 text-sm text-[var(--text-body)]">
          Welcome back. Enter your details to continue.
        </p>

        <div className="mt-6">
          <SignInForm />
        </div>
      </AuthCard>
    </AuthShell>
  );
}