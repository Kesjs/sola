-- Sola core schema. Ayiba already hosts other products, so all tables are namespaced.
create table public.sola_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  telegram_id text unique,
  created_at timestamptz not null default now()
);

create table public.sola_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  public_address text not null,
  network text not null check (network in ('devnet','mainnet-beta')),
  active boolean not null default true,
  connected_at timestamptz not null default now(),
  unique (user_id, public_address, network)
);

create table public.sola_operations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  wallet_id uuid not null references public.sola_wallets(id) on delete restrict,
  type text not null check (type in ('send','swap')),
  status text not null default 'draft' check (status in ('draft','verified','signed','pending','confirmed','failed','expired','cancelled')),
  parameters jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table public.sola_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  operation_id uuid references public.sola_operations(id) on delete set null,
  wallet_id uuid not null references public.sola_wallets(id) on delete restrict,
  signature text not null unique,
  type text not null check (type in ('received','sent','swap')),
  status text not null check (status in ('pending','confirmed','failed')),
  amount numeric,
  token text check (token in ('SOL','USDT')),
  network_fee numeric,
  confirmed_at timestamptz,
  observed_at timestamptz not null default now()
);

create table public.sola_quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  operation_id uuid not null references public.sola_operations(id) on delete cascade,
  token_sold text not null check (token_sold in ('SOL','USDT')),
  token_received text not null check (token_received in ('SOL','USDT')),
  rate numeric not null,
  estimated_amount numeric not null,
  sola_fee numeric not null default 0,
  network_fee numeric,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (token_sold <> token_received)
);

create table public.sola_fee_config (
  id uuid primary key default gen_random_uuid(),
  operation_type text not null unique check (operation_type in ('send','swap')),
  percentage numeric not null default 0 check (percentage >= 0),
  minimum numeric check (minimum is null or minimum >= 0),
  maximum numeric check (maximum is null or maximum >= 0),
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.sola_agent_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','tool')),
  content text not null,
  tool_call jsonb,
  created_at timestamptz not null default now()
);

create table public.sola_security_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index sola_wallets_user_idx on public.sola_wallets(user_id);
create index sola_operations_user_idx on public.sola_operations(user_id, created_at desc);
create index sola_transactions_user_idx on public.sola_transactions(user_id, observed_at desc);
create index sola_agent_messages_user_idx on public.sola_agent_messages(user_id, created_at);

alter table public.sola_profiles enable row level security;
alter table public.sola_wallets enable row level security;
alter table public.sola_operations enable row level security;
alter table public.sola_transactions enable row level security;
alter table public.sola_quotes enable row level security;
alter table public.sola_fee_config enable row level security;
alter table public.sola_agent_messages enable row level security;
alter table public.sola_security_logs enable row level security;

create policy sola_profiles_owner on public.sola_profiles for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy sola_wallets_owner on public.sola_wallets for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy sola_operations_owner on public.sola_operations for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy sola_transactions_owner_read on public.sola_transactions for select to authenticated using ((select auth.uid()) = user_id);
create policy sola_quotes_owner on public.sola_quotes for select to authenticated using ((select auth.uid()) = user_id);
create policy sola_fee_config_authenticated_read on public.sola_fee_config for select to authenticated using (true);
create policy sola_fee_config_admin_write on public.sola_fee_config for all to authenticated using (exists (select 1 from public.users where id = (select auth.uid()) and role = 'admin')) with check (exists (select 1 from public.users where id = (select auth.uid()) and role = 'admin'));
create policy sola_agent_messages_owner on public.sola_agent_messages for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy sola_security_logs_admin_read on public.sola_security_logs for select to authenticated using (exists (select 1 from public.users where id = (select auth.uid()) and role = 'admin'));

insert into public.sola_fee_config (operation_type, percentage)
values ('send', 0), ('swap', 0)
on conflict (operation_type) do nothing;
