import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../../config/supabase';
import type { AuthState, AuthUser, Tenant, Role } from '../types/auth.types';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
  can: (permission: string) => boolean;
  hasRole: (roleName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    tenant: null,
    permissions: [],
    loading: true,
    initialized: false,
  });

  const loadUserProfile = useCallback(async (supabaseUser: User, session: Session) => {
    try {
      const tenantId = supabaseUser.app_metadata?.tenant_id;

      let tenant: Tenant | null = null;
      let role: Role | null = null;
      let permissions: string[] = [];

      if (tenantId) {
        // Fetch tenant
        const { data: tenantData } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', tenantId)
          .single();
        tenant = tenantData;

        // Fetch member + role
        const { data: memberData } = await supabase
          .from('tenant_members')
          .select('*, role:roles(*)')
          .eq('tenant_id', tenantId)
          .eq('user_id', supabaseUser.id)
          .eq('status', 'active')
          .single();

        if (memberData?.role) {
          role = memberData.role as Role;

          // If admin, grant all permissions
          if (role.name === 'admin') {
            const { data: allPerms } = await supabase
              .from('permissions')
              .select('code');
            permissions = allPerms?.map((p) => p.code) ?? [];
          } else {
            // Fetch role permissions
            const { data: rolePerms } = await supabase
              .from('role_permissions')
              .select('permission:permissions(code)')
              .eq('role_id', role.id);
            permissions = rolePerms
              ?.map((rp: any) => rp.permission?.code)
              .filter(Boolean) ?? [];
          }
        }
      }

      const authUser: AuthUser = {
        id: supabaseUser.id,
        email: supabaseUser.email ?? '',
        name: supabaseUser.user_metadata?.name ?? supabaseUser.email?.split('@')[0] ?? '',
        avatar_url: supabaseUser.user_metadata?.avatar_url ?? null,
        tenant_id: tenantId ?? null,
        role,
        permissions,
      };

      setState({
        user: authUser,
        session,
        tenant,
        permissions,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setState((prev) => ({ ...prev, loading: false, initialized: true }));
    }
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user, session);
      } else {
        setState((prev) => ({ ...prev, loading: false, initialized: true }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user, session);
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            session: null,
            tenant: null,
            permissions: [],
            loading: false,
            initialized: true,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadUserProfile]);

  const signIn = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setState((prev) => ({ ...prev, loading: false }));
    return { error: error as Error | null };
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const can = (permission: string): boolean => {
    if (!state.user) return false;
    // Admin has all permissions
    if (state.user.role?.name === 'admin') return true;
    // Wildcard check: 'finance.*' matches 'finance.read'
    return state.permissions.some((p) => {
      if (p === permission) return true;
      const [mod] = p.split('.');
      return permission === `${mod}.*`;
    });
  };

  const hasRole = (roleName: string): boolean => {
    return state.user?.role?.name === roleName;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signInWithGoogle,
        signInWithGitHub,
        signOut,
        can,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
