// Auth module type definitions

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  plan: string;
  logo_url: string | null;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  tenant_id: string | null;
  name: string;
  display_name: string;
  description: string | null;
  hierarchy_level: number;
  is_system: boolean;
}

export interface Permission {
  id: string;
  code: string;
  module: string;
  action: string;
  description: string | null;
}

export interface TenantMember {
  id: string;
  tenant_id: string;
  user_id: string;
  role_id: string;
  status: 'active' | 'suspended' | 'pending';
  joined_at: string;
  role?: Role;
}

export interface Invitation {
  id: string;
  tenant_id: string;
  email: string;
  role_id: string;
  invited_by: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expires_at: string;
  created_at: string;
  accepted_at: string | null;
  role?: Role;
  tenant?: Tenant;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  tenant_id: string | null;
  role: Role | null;
  permissions: string[];
}

export interface AuthState {
  user: AuthUser | null;
  session: import('@supabase/supabase-js').Session | null;
  tenant: Tenant | null;
  permissions: string[];
  loading: boolean;
  initialized: boolean;
}
