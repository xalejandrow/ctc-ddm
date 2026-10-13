-- Ejecutar en Supabase: SQL Editor > New query.
create table if not exists public.tasks (
  id text primary key,
  title text not null,
  status text not null check (status in ('PENDIENTE', 'FINALIZADA')),
  updated_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

-- POLÍTICAS DIDÁCTICAS: cualquier persona que tenga la clave pública puede leer/escribir.
-- Para producción: agregar autenticación y reemplazarlas por user_id = auth.uid().
grant select, insert, update, delete on public.tasks to anon, authenticated;
create policy "demo_select_tasks" on public.tasks for select to anon, authenticated using (true);
create policy "demo_insert_tasks" on public.tasks for insert to anon, authenticated with check (true);
create policy "demo_update_tasks" on public.tasks for update to anon, authenticated using (true) with check (true);
create policy "demo_delete_tasks" on public.tasks for delete to anon, authenticated using (true);
