create table if not exists public.onboarding_access_attempts (
  ip_hash text primary key,
  attempt_count integer not null default 0,
  window_started_at timestamptz not null default now(),
  last_attempt_at timestamptz not null default now()
);

alter table public.onboarding_access_attempts enable row level security;

create index if not exists onboarding_access_attempts_last_attempt_idx
  on public.onboarding_access_attempts (last_attempt_at desc);
