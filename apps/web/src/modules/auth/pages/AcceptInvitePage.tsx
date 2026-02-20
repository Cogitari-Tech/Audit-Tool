import { useState, useEffect, type FormEvent } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '../../../config/supabase';
import type { Invitation } from '../types/auth.types';

export function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchInvitation = async () => {
      const { data, error: fetchError } = await supabase
        .from('invitations')
        .select('*, role:roles(name, display_name), tenant:tenants(name, slug)')
        .eq('token', token)
        .eq('status', 'pending')
        .single();

      if (fetchError || !data) {
        setError('Convite inválido ou expirado.');
      } else if (new Date(data.expires_at) < new Date()) {
        setError('Este convite expirou. Solicite um novo ao administrador.');
      } else {
        setInvitation(data as Invitation);
      }
      setLoading(false);
    };

    fetchInvitation();
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!invitation) return;

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      // 1. Create user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: invitation.email,
        password,
        options: {
          data: { name },
        },
      });

      if (signUpError || !authData.user) {
        setError(signUpError?.message ?? 'Erro ao criar conta.');
        setSubmitting(false);
        return;
      }

      // 2. Mark invitation as accepted (via service role edge function or RPC)
      await supabase
        .from('invitations')
        .update({ status: 'accepted', accepted_at: new Date().toISOString() })
        .eq('id', invitation.id);

      setSuccess(true);
    } catch {
      setError('Erro inesperado. Tente novamente.');
    }
    setSubmitting(false);
  };

  if (success) {
    return <Navigate to="/login" replace />;
  }

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
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
              <p className="text-sm text-slate-400">Verificando convite...</p>
            </div>
          ) : error && !invitation ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                <svg className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Convite inválido</h2>
              <p className="text-sm text-slate-400 mb-6">{error}</p>
              <a href="/login" className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors">
                ← Ir para o login
              </a>
            </div>
          ) : invitation ? (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-white">Criar sua conta</h1>
                <p className="mt-2 text-sm text-slate-400">
                  Você foi convidado para <span className="text-white font-medium">{invitation.tenant?.name}</span>{' '}
                  como <span className="text-brand-400 font-medium">{invitation.role?.display_name}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="invite-email" className="mb-1.5 block text-sm font-medium text-slate-300">E-mail</label>
                  <input
                    id="invite-email"
                    type="email"
                    value={invitation.email}
                    disabled
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400 opacity-60 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-300">Nome completo</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 backdrop-blur-md transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label htmlFor="invite-password" className="mb-1.5 block text-sm font-medium text-slate-300">Senha</label>
                  <input
                    id="invite-password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 backdrop-blur-md transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-slate-300">Confirmar senha</label>
                  <input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 backdrop-blur-md transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50"
                >
                  {submitting ? 'Criando conta...' : 'Criar conta e acessar'}
                </button>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
