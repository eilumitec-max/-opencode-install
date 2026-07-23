insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('logos', 'logos', true, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

create policy "Publicas podem ler logos"
on storage.objects for select
using ( bucket_id = 'logos' );

create policy "Qualquer usuario autenticado pode enviar logo"
on storage.objects for insert
with check (
  bucket_id = 'logos'
  and auth.role() = 'authenticated'
);
