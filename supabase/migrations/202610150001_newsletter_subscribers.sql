create table if not exists public.newsletter_subscribers (
 id uuid primary key default gen_random_uuid(),
 email text not null unique,
 consent boolean not null default false,
 consent_source text not null default 'website_newsletter',
 subscribed_at timestamptz not null default now(),
 unsubscribed_at timestamptz,
 created_at timestamptz not null default now(),
 constraint newsletter_subscribers_email_lowercase check (email = lower(email)),
 constraint newsletter_subscribers_consent_check check (consent = true)
);
alter table public.newsletter_subscribers enable row level security;
revoke all on table public.newsletter_subscribers from anon, authenticated;
grant all on table public.newsletter_subscribers to service_role;