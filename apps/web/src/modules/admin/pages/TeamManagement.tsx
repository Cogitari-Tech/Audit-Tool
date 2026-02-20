import { useState, useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { useAuth } from '../../auth/context/AuthContext';
import type { TenantMember, Role } from '../../auth/types/auth.types';
import { UserPlus, Shield, MoreVertical, Search, X } from 'lucide-react';

export function TeamManagement() {
  const { tenant, user } = useAuth();
  const [members, setMembers] = useState<(TenantMember & { user_email?: string; user_name?: string })[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRoleId, setInviteRoleId] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ success: boolean; message: string; link?: string } | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!tenant) return;

    const fetchData = async () => {
      const [membersRes, rolesRes] = await Promise.all([
        supabase.from('tenant_members').select('*, role:roles(*)').eq('tenant_id', tenant.id),
        supabase.from('roles').select('*').or(`tenant_id.eq.${tenant.id},tenant_id.is.null`).order('hierarchy_level', { ascending: false }),
      ]);
      setMembers(membersRes.data ?? []);
      setRoles(rolesRes.data ?? []);
      setLoading(false);
    };

    fetchData();
  }, [tenant]);

  const handleInvite = async () => {
    if (!inviteEmail || !inviteRoleId) return;
    setInviteLoading(true);
    setInviteResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invitation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ email: inviteEmail, role_id: inviteRoleId }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setInviteResult({ success: true, message: 'Convite enviado com sucesso!', link: data.invite_link });
        setInviteEmail('');
        setInviteRoleId('');
      } else {
        setInviteResult({ success: false, message: data.error ?? 'Erro ao enviar convite.' });
      }
    } catch {
      setInviteResult({ success: false, message: 'Erro de conexão.' });
    }
    setInviteLoading(false);
  };

  const filteredMembers = members.filter((m) =>
    !search || m.user_email?.toLowerCase().includes(search.toLowerCase()) || m.user_name?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadgeColor = (roleName: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-500/10 text-red-400 border-red-500/20',
      gerente: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      financeiro: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      auditor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      contador: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      engenharia: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      qa: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      marketing: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    };
    return colors[roleName] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Equipe</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gerencie membros e permissões da sua organização
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-600"
        >
          <UserPlus className="h-4 w-4" />
          Convidar membro
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        />
      </div>

      {/* Members Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-16">
            <Shield className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Nenhum membro encontrado</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Membro</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Função</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Desde</th>
                <th className="px-6 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold">
                        {(member.user_name ?? member.user_id)?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{member.user_name ?? 'Usuário'}</p>
                        <p className="text-xs text-slate-500">{member.user_email ?? member.user_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${getRoleBadgeColor((member.role as any)?.name ?? '')}`}>
                      {(member.role as any)?.display_name ?? 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      member.status === 'active' ? 'text-emerald-500' : member.status === 'suspended' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        member.status === 'active' ? 'bg-emerald-500' : member.status === 'suspended' ? 'bg-red-400' : 'bg-amber-400'
                      }`} />
                      {member.status === 'active' ? 'Ativo' : member.status === 'suspended' ? 'Suspenso' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(member.joined_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    {member.user_id !== user?.id && (
                      <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 border border-white/20 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Convidar membro</h2>
              <button onClick={() => { setShowInviteModal(false); setInviteResult(null); }} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            {inviteResult && (
              <div className={`rounded-lg border px-4 py-3 text-sm mb-4 ${
                inviteResult.success
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-red-500/30 bg-red-500/10 text-red-400'
              }`}>
                {inviteResult.message}
                {inviteResult.link && (
                  <p className="mt-2 text-xs break-all font-mono opacity-75">{inviteResult.link}</p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">E-mail</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colaborador@empresa.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Função</label>
                <select
                  value={inviteRoleId}
                  onChange={(e) => setInviteRoleId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="">Selecione uma função...</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.display_name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleInvite}
                disabled={inviteLoading || !inviteEmail || !inviteRoleId}
                className="w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {inviteLoading ? 'Enviando...' : 'Enviar convite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
