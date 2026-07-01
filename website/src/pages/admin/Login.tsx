import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Lock } from "lucide-react";
import { useAuth } from "@/admin/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export function AdminLogin() {
  const { signIn, isAuthed } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthed) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthed, navigate]);

  if (isAuthed) {
    return null;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (signIn(email, password)) {
      navigate("/admin", { replace: true });
    } else {
      setError("Those details did not match. Please try again.");
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-5 py-16">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(238,48,48,0.3),transparent_55%)]" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <img src="/img/logo/gksa-white.png" alt="GKSA" className="h-12 w-auto" />
          <span className="font-display text-xl font-bold uppercase tracking-wide text-white">
            GKSA Admin
          </span>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center gap-2 text-white">
            <Lock className="size-5 text-primary" />
            <h1 className="text-xl font-bold">Sign in</h1>
          </div>

          <form
            onSubmit={submit}
            className="space-y-4 [&_label]:text-white/80 [&_input]:border-white/15 [&_input]:bg-white/5 [&_input]:text-white"
          >
            <Field label="Email" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@goldenknightsfc.co.za"
                autoComplete="username"
              />
            </Field>
            <Field label="Password" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
              />
            </Field>

            {error && <p className="text-sm font-medium text-primary">{error}</p>}

            <Button type="submit" size="lg" className="w-full">
              <LogIn /> Sign in
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          Demo access only. Credentials are for the preview and are not secure.
        </p>
      </div>
    </div>
  );
}
