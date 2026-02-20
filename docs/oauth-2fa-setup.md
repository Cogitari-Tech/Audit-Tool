# Configuração OAuth & 2FA — Guia de Setup

> Este documento descreve como configurar Google OAuth, GitHub OAuth e 2FA (TOTP) no Supabase para o sistema Amuri-Audit.

---

## 1. Google OAuth

### Pré-requisitos

- Conta no [Google Cloud Console](https://console.cloud.google.com)
- Projeto Google Cloud criado

### Passo a passo

#### 1.1 Criar credenciais OAuth no Google Cloud

1. Acesse **APIs & Services → Credentials** no Google Cloud Console
2. Clique em **Create Credentials → OAuth Client ID**
3. Selecione **Web application**
4. Preencha os campos:
   - **Name**: `Amuri Audit - Supabase Auth`
   - **Authorized JavaScript origins**:
     - `https://app.cogitari.com.br` (produção)
     - `http://localhost:5173` (desenvolvimento)
   - **Authorized redirect URIs**:
     - `https://ugbtatpthehymengorqf.supabase.co/auth/v1/callback` (dev)
     - `https://zyjrniwspbfhrwrjqebo.supabase.co/auth/v1/callback` (prod)
5. Copie o **Client ID** e **Client Secret**

#### 1.2 Configurar no Supabase Dashboard

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard) → seu projeto
2. Vá em **Authentication → Providers → Google**
3. Ative o toggle **Enable Sign in with Google**
4. Cole o **Client ID** e **Client Secret**
5. Salve

> [!IMPORTANT]
> Configure **ambos** os projetos (amuri-dev e amuri-prod) com as respectivas redirect URIs.

---

## 2. GitHub OAuth

### Pré-requisitos

- Conta GitHub com acesso a [Developer Settings](https://github.com/settings/developers)

### Passo a passo

#### 2.1 Criar OAuth App no GitHub

1. Acesse **GitHub → Settings → Developer Settings → OAuth Apps**
2. Clique em **New OAuth App**
3. Preencha:
   - **Application name**: `Amuri Audit`
   - **Homepage URL**: `https://app.cogitari.com.br`
   - **Authorization callback URL**:
     - Dev: `https://ugbtatpthehymengorqf.supabase.co/auth/v1/callback`
     - Prod: `https://zyjrniwspbfhrwrjqebo.supabase.co/auth/v1/callback`
4. Clique em **Register application**
5. Gere um **Client Secret** e copie ambos (Client ID + Secret)

#### 2.2 Configurar no Supabase Dashboard

1. Supabase Dashboard → **Authentication → Providers → GitHub**
2. Ative **Enable Sign in with GitHub**
3. Cole **Client ID** e **Client Secret**
4. Salve

> [!TIP]
> Para desenvolvimento, você pode criar um OAuth App separado no GitHub apontando para a URL do Supabase dev.

---

## 3. 2FA (Autenticação de Dois Fatores - TOTP)

### Como funciona

O Supabase Auth suporta nativamente o **TOTP (Time-based One-Time Password)**, que é o padrão usado por apps como Google Authenticator, Authy e 1Password.

### Fluxo do usuário

```
1. Usuário acessa Configurações → Segurança
2. Clica em "Ativar 2FA"
3. Supabase gera uma chave secreta e um QR Code
4. Usuário escaneia o QR com o app de autenticação
5. Usuário digita o código de 6 dígitos para confirmar
6. 2FA ativado — próximos logins exigem o código
```

### Implementação técnica

#### 3.1 Enrollment (ativação)

```typescript
// Iniciar enrollment de MFA
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: "totp",
  friendlyName: "Authenticator App",
});

// data.totp contém:
// - qr_code: string (data URL do QR code)
// - secret: string (chave TOTP para inserção manual)
// - uri: string (otpauth:// URI)
```

#### 3.2 Verificação (confirmação do enrollment)

```typescript
// Criar challenge
const { data: challenge } = await supabase.auth.mfa.challenge({
  factorId: data.id,
});

// Verificar com o código do app
const { data: verify } = await supabase.auth.mfa.verify({
  factorId: data.id,
  challengeId: challenge.id,
  code: "123456", // código do app
});
```

#### 3.3 Login com 2FA

```typescript
// Após signInWithPassword, verificar se MFA é necessário
const { data: factors } = await supabase.auth.mfa.listFactors();

if (factors.totp.length > 0) {
  // Criar challenge para o fator TOTP
  const { data: challenge } = await supabase.auth.mfa.challenge({
    factorId: factors.totp[0].id,
  });

  // Pedir código ao usuário e verificar
  const { data: verify } = await supabase.auth.mfa.verify({
    factorId: factors.totp[0].id,
    challengeId: challenge.id,
    code: userInputCode,
  });
}
```

### Política de Enforcement

| Role             | 2FA Obrigatório? | Justificativa               |
| ---------------- | :--------------: | --------------------------- |
| Admin / C-Level  |      ✅ Sim      | Acesso total ao sistema     |
| Financeiro / CFO |      ✅ Sim      | Dados financeiros sensíveis |
| Auditor          |      ✅ Sim      | Logs e compliance           |
| Gerente / PO     |  ⚠️ Recomendado  | Acesso a aprovações         |
| Contador         |  ⚠️ Recomendado  | Relatórios financeiros      |
| Engenharia       |  ⚠️ Recomendado  | API keys e infra            |
| QA               |   ❌ Opcional    | Acesso limitado             |
| Marketing        |   ❌ Opcional    | Acesso limitado             |

> [!WARNING]
> A obrigatoriedade do 2FA deve ser implementada no `AuthGuard` ou `AuthContext`, verificando `supabase.auth.mfa.getAuthenticatorAssuranceLevel()`. Se o nível retornado for `aal1` e a role exigir `aal2`, redirecionar para a tela de verificação MFA.

### Checklist de implementação 2FA

- [ ] Criar componente `TwoFactorSetup.tsx` com QR code e input de verificação
- [ ] Criar componente `TwoFactorChallenge.tsx` para tela de verificação no login
- [ ] Adicionar verificação AAL no `AuthGuard` para roles obrigatórias
- [ ] Adicionar opção "Desativar 2FA" nas configurações do usuário

---

## 4. Variáveis de Ambiente Necessárias

Nenhuma variável adicional é necessária no `.env` do projeto frontend. Toda configuração OAuth é feita no Supabase Dashboard.

Para as **Edge Functions**, as variáveis já estão disponíveis automaticamente:

- `SUPABASE_URL` — URL do projeto
- `SUPABASE_ANON_KEY` — Chave pública
- `SUPABASE_SERVICE_ROLE_KEY` — Chave de serviço (já configurada)

### Variável opcional para e-mails de convite

```env
APP_URL=https://app.cogitari.com.br
```

> Esta variável é usada pela Edge Function `send-invitation` para gerar links de convite. Se não definida, usa `https://app.cogitari.com.br` como fallback.

---

## Resumo de ações manuais necessárias

| Ação                                     | Onde                                          | Prioridade |
| ---------------------------------------- | --------------------------------------------- | :--------: |
| Criar OAuth App Google                   | Google Cloud Console                          |  🔴 Alta   |
| Criar OAuth App GitHub                   | GitHub Developer Settings                     |  🔴 Alta   |
| Configurar Google Provider no Supabase   | Supabase Dashboard (dev + prod)               |  🔴 Alta   |
| Configurar GitHub Provider no Supabase   | Supabase Dashboard (dev + prod)               |  🔴 Alta   |
| Implementar componente TwoFactorSetup    | Código frontend                               |  🟡 Média  |
| Implementar verificação AAL no AuthGuard | Código frontend                               |  🟡 Média  |
| Definir `APP_URL` nas Edge Functions     | Supabase Dashboard → Edge Functions → Secrets |  🟢 Baixa  |
