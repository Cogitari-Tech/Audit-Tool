import { useState, type FormEvent } from 'react';
import { supabase } from '../../../config/supabase';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (resetError) {
      setError('Erro ao enviar e-mail de recuperação. Tente novamente.');
    } else {
      setSent(true);
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4"
      style={{
        backgroundImage:
          'radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 1) 0, transparent 50%)',
      }}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <img src="/images/logo-cogitari.png" alt="Cogitari" className="h-12 w-auto drop-shadow-lg" />
        </div>

        <div className="glass-card p-8 border border-white/20">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
                <svg className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">E-mail enviado!</h2>
              <p className="text-sm text-slate-400 mb-6">
                Verifique sua caixa de entrada em <span className="text-white font-medium">{email}</span> e siga as instruções para redefinir sua senha.
              </p>
              <a href="/login" className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors">
                ← Voltar ao login
              </a>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-white">Recuperar senha</h1>
                <p className="mt-2 text-sm text-slate-400">
                  Informe seu e-mail corporativo para receber o link de recuperação
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                    E-mail corporativo
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@empresa.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 backdrop-blur-md transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50"
                >
                  {submitting ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </form>

              <p className="mt-6 text-center">
                <a href="/login" className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors">
                  ← Voltar ao login
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
