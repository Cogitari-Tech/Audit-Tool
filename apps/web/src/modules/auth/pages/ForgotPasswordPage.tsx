import { useState, type FormEvent } from "react";
import { supabase } from "../../../config/supabase";
import { Activity, ShieldCheck, Database } from "lucide-react";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    );

    if (resetError) {
      setError("Erro ao enviar e-mail de recuperação. Tente novamente.");
    } else {
      setSent(true);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* 
        RADICAL ASYMMETRIC LAYOUT (70/30 split)
      */}
      <div className="hidden md:flex flex-col justify-between w-[65%] border-r border-border p-12 lg:p-24 relative overflow-hidden bg-slate-950">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
          }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <img
            src="/images/logo-cogitari.png"
            alt="Cogitari"
            className="h-8 w-auto mix-blend-screen"
          />
          <span className="text-secondary-foreground/40 font-mono text-xs tracking-widest uppercase border border-border/30 px-3 py-1 bg-background/5">
            System Auth v2.0
          </span>
        </div>

        <div className="relative z-10 space-y-8 mt-24 flex-grow flex flex-col justify-center">
          <h1 className="text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.1]">
            <span className="block text-primary mb-2">PRECISÃO.</span>
            DADOS SOB <br /> CONTROLE.
          </h1>
          <p className="max-w-xl text-lg text-slate-400 font-light leading-relaxed">
            Plataforma corporativa de auditoria e compliance financeiro. Acesso
            restrito ao pessoal autorizado.
          </p>

          <div className="flex gap-8 pt-8 border-t border-border/30 w-fit">
            <div className="flex flex-col gap-2">
              <ShieldCheck className="text-primary w-6 h-6 stroke-[1.5]" />
              <span className="text-xs font-mono text-slate-500 uppercase">
                Isolamento
                <br />
                Garantido
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Database className="text-primary w-6 h-6 stroke-[1.5]" />
              <span className="text-xs font-mono text-slate-500 uppercase">
                Dados
                <br />
                Críticos
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Activity className="text-primary w-6 h-6 stroke-[1.5]" />
              <span className="text-xs font-mono text-slate-500 uppercase">
                Alta
                <br />
                Performance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-background relative">
        <div className="w-full max-w-sm mx-auto space-y-8">
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-start mb-8 pb-8 border-b border-border">
            <img
              src="/images/logo-cogitari.png"
              alt="Cogitari"
              className="h-8 w-auto"
            />
          </div>

          {sent ? (
            <div className="space-y-6 pt-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-primary text-primary bg-primary/5">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    strokeWidth={1.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                E-mail Enviado
              </h2>
              <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                Verifique sua caixa de entrada em{" "}
                <span className="text-foreground font-bold">{email}</span> e
                siga as instruções para redefinir sua senha.
              </p>
              <div className="pt-4">
                <a
                  href="/login"
                  className="text-xs font-mono text-primary hover:underline transition-colors uppercase tracking-widest"
                >
                  ← Voltar ao login
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  Recuperação
                </h2>
                <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                  Redefinição de Credenciais
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                {error && (
                  <div className="border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive font-mono">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
                  >
                    E-mail corporativo
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="auditor@empresa.com"
                    className="w-full px-4 py-3 text-sm bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors rounded-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-primary-foreground py-3 text-sm font-bold tracking-widest uppercase hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-all rounded-none"
                >
                  {submitting ? "Enviando..." : "Enviar Link de Recuperação"}
                </button>
              </form>

              <div className="pt-6 text-center">
                <a
                  href="/login"
                  className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                >
                  ← Voltar à Autenticação
                </a>
              </div>
            </>
          )}
        </div>

        {/* Footer info strictly positioned */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-[10px] font-mono text-muted-foreground uppercase opacity-50 tracking-[0.2em]">
            V 2.5.0 · AMURI AUDIT
          </p>
        </div>
      </div>
    </div>
  );
}
