import { AuthShell } from "@/app/components/auth/auth-shell";
import { AuthCard } from "@/app/components/auth/auth-card";
import { SignInForm } from "@/app/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <AuthShell>
      <AuthCard>
        <div className="text-center">
          <h2 className="text-lg font-semibold">Sign in</h2>
          <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
            Welcome back. Enter your details to continue.
          </p>
        </div>

        <div className="mt-3">
          <SignInForm />
        </div>
      </AuthCard>
    </AuthShell>
  );
}