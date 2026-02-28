import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { ThemeToggle } from "../../../shared/components/ui/ThemeToggle";
import {
  ShieldCheck,
  Database,
  Activity,
  ArrowRight,
  Loader2,
  KeyRound,
} from "lucide-react";

export function LandingPage() {
  const { user, signIn, signUp, loading: authLoading } = useAuth();

  // Auth Form State
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For register only
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  if (user) return <Navigate to="/dashboard" replace />;

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (authMode === "login") {
        const { error: authError } = await signIn(email, password);
        if (authError) {
          setError(
            authError.message === "Invalid login credentials"
              ? "E-mail ou senha incorretos."
              : "Erro ao fazer login. Tente novamente.",
          );
        }
      } else {
        if (password.length < 6) {
          setError("A senha deve ter pelo menos 6 caracteres.");
          return;
        }
        const { error: signUpError } = await signUp(email, password, { name });
        if (signUpError) throw signUpError;
        // On success, redirect to verify email happens automatically inside AuthGuard or AuthContext usually,
        // but since we are bare-metal here, we'd traditionally show a success message or let the guard handle it.
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro na autenticação.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === "login" ? "register" : "login"));
    setError(null);
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-brand-500 selection:text-white overflow-x-hidden">
      {/* ─── NAV HEADER ────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 px-6 py-4 flex items-center justify-between mix-blend-difference text-white">
        <div className="flex items-center gap-2">
          <img
            src="/images/logo-cogitari-dark.png"
            alt="Cogitari"
            className="h-6 w-auto"
          />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70 border border-white/20 px-2 py-0.5 rounded-sm">
            Enterprise Security
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* ─── BRUTALIST HERO + ASYMMETRIC TENSION ────────────────────── */}
      <main className="relative min-h-screen flex flex-col xl:flex-row items-center justify-between p-6 pt-32 xl:p-24 overflow-hidden">
        {/* Abstract Background Elements (Not standard soft blobs, sharp intersecting lines) */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-[20%] left-[-10%] w-[120%] h-[1px] bg-white/30 rotate-[-12deg]"></div>
          <div className="absolute top-[60%] right-[-10%] w-[120%] h-[1px] bg-brand-500/50 rotate-[15deg]"></div>
          <div className="absolute top-[-20%] left-[30%] w-[1px] h-[150%] bg-white/20 rotate-[30deg]"></div>
        </div>

        {/* LEFT COMPONENT: MASSIVE TYPOGRAPHY */}
        <div className="relative z-10 w-full xl:w-[55%] flex flex-col gap-8 mb-16 xl:mb-0">
          <h1 className="text-6xl md:text-[6rem] xl:text-[8rem] font-bold text-white leading-[0.85] tracking-tighter mix-blend-difference uppercase">
            AUDITORIA <br />
            <span
              className="text-transparent border-text-white"
              style={{ WebkitTextStroke: "2px rgba(255,255,255,0.8)" }}
            >
              PRECISA.
            </span>{" "}
            <br />
            ZERO <span className="text-brand-500">RISCO.</span>
          </h1>

          <p className="max-w-xl text-lg md:text-xl text-slate-400 font-medium leading-relaxed border-l-2 border-brand-500 pl-6">
            Plataforma brutalista de compliance financeiro. Gestão estratégica
            de dados com execução implacável e rastreabilidade total. Não é
            apenas software, é o seu cofre corporativo.
          </p>

          <div className="flex flex-wrap gap-6 pt-8 max-w-2xl">
            <div className="flex items-start gap-4 p-4 border border-white/10 bg-black/40 backdrop-blur-md rounded-none">
              <ShieldCheck className="text-brand-500 w-6 h-6 shrink-0" />
              <div>
                <h4 className="text-white font-bold text-sm tracking-widest uppercase">
                  Blindagem
                </h4>
                <p className="text-slate-500 text-sm mt-1">
                  Criptografia E2E em todos os fluxos e aprovações.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border border-white/10 bg-black/40 backdrop-blur-md rounded-none">
              <Database className="text-brand-500 w-6 h-6 shrink-0" />
              <div>
                <h4 className="text-white font-bold text-sm tracking-widest uppercase">
                  Isolamento
                </h4>
                <p className="text-slate-500 text-sm mt-1">
                  Arquitetura Multi-Tenant isolada por design.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border border-white/10 bg-black/40 backdrop-blur-md rounded-none">
              <Activity className="text-brand-500 w-6 h-6 shrink-0" />
              <div>
                <h4 className="text-white font-bold text-sm tracking-widest uppercase">
                  Tempo Real
                </h4>
                <p className="text-slate-500 text-sm mt-1">
                  Timelines ativas e websockets em instâncias chave.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: SLIDING AUTH CONTAINER (Anti-Safe Harbor / Sharp Edges) */}
        <div className="relative z-10 w-full xl:w-[40%] max-w-md xl:max-w-lg mt-8 xl:mt-0 flex justify-end">
          {/* Main Auth Frame (Raw Border, clay-dark shadow, no soft rounded corners) */}
          <div className="relative w-full h-[550px] bg-slate-900 border border-slate-700 shadow-clay-dark overflow-hidden group">
            {/* Sliding Panel Wrapper - Animates left/right based on AuthMode */}
            <div
              className="absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
              style={{
                transform:
                  authMode === "login" ? "translateX(0)" : "translateX(-50%)",
              }}
            >
              {/* === LOGIN CARD === */}
              <div className="w-1/2 h-full p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tighter uppercase mb-2">
                    Entrar
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Acesse sua instância corporativa.
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-6 mt-8">
                  {error && (
                    <div className="p-4 bg-red-500/10 border-l-2 border-red-500 text-red-500 text-sm font-medium">
                      {error}
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        E-mail Organizacional
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border border-slate-700 text-white px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors rounded-none placeholder:text-slate-600"
                        placeholder="nome@empresa.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Senha de Acesso
                        </label>
                        <Link
                          to="/forgot-password"
                          className="text-xs text-brand-500 hover:text-brand-400"
                        >
                          Esqueceu?
                        </Link>
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-slate-700 text-white px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors rounded-none placeholder:text-slate-600 font-mono tracking-widest"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || authLoading}
                    className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white py-4 font-bold tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]"
                  >
                    {submitting || authLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Acessar Sistema"
                    )}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                  <p className="text-slate-400 text-sm">
                    Não possui uma credencial?{" "}
                    <button
                      onClick={toggleAuthMode}
                      className="text-white font-bold hover:text-brand-500 transition-colors uppercase tracking-wider text-xs ml-2"
                    >
                      Cadastre-se
                    </button>
                  </p>
                </div>
              </div>

              {/* === REGISTER CARD === */}
              <div className="w-1/2 h-full p-8 md:p-12 flex flex-col justify-between bg-slate-950 border-l border-slate-800 relative shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tighter uppercase mb-2">
                    Criar Conta
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Inicie sua esteira de auditoria.
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-5 mt-6">
                  {error && (
                    <div className="p-3 bg-red-500/10 border-l-2 border-red-500 text-red-500 text-xs font-medium">
                      {error}
                    </div>
                  )}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/50 border border-slate-700 text-white px-4 py-2 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors rounded-none placeholder:text-slate-600"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        E-mail Profissional
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border border-slate-700 text-white px-4 py-2 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors rounded-none placeholder:text-slate-600"
                        placeholder="nome@empresa.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Definir Senha
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-slate-700 text-white px-4 py-2 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors rounded-none placeholder:text-slate-600 font-mono tracking-widest"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || authLoading}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-slate-200 py-3 font-bold tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {submitting || authLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Iniciar Autenticação"
                    )}
                    <KeyRound className="w-4 h-4 ml-2" />
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                  <p className="text-slate-400 text-sm">
                    Já possui acesso?{" "}
                    <button
                      onClick={toggleAuthMode}
                      className="text-white font-bold hover:text-brand-500 transition-colors uppercase tracking-wider text-xs ml-2"
                    >
                      Volte ao Login
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
