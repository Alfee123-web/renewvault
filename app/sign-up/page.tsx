import { AuthShell } from "@/app/components/auth/auth-shell";
import { AuthCard } from "@/app/components/auth/auth-card";
import { SignUpForm } from "@/app/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <AuthShell>
      {/* Change the vertical movement using this top-[-px] attribute*/}
      <div className="relative top-[-16px] w-full">
        <AuthCard>
          <div className="text-center">
            <h2 className="text-lg font-semibold">Sign up</h2>
            <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
              Create your RenewVault account to get started.
            </p>
          </div>

          <div className="mt-3">
            <SignUpForm />
          </div>
        </AuthCard>
      </div>
    </AuthShell>
  );
}