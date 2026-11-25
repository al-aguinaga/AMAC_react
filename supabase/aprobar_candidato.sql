-- RF-054: aprobar un candidato (equivale a poner aprobado = true en el Table Editor).
update public.perfiles
set aprobado = true
where id = (select id from auth.users where email = 'candidato.aprobado@amac-demo.com');
