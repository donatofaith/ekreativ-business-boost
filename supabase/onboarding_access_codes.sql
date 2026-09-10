create table if not exists public.onboarding_access_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  client_label text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  redeemed_at timestamptz,
  redeemed_session_id text
);

alter table public.onboarding_access_codes enable row level security;

create index if not exists onboarding_access_codes_code_hash_idx
  on public.onboarding_access_codes (code_hash);

create index if not exists onboarding_access_codes_created_at_idx
  on public.onboarding_access_codes (created_at desc);
