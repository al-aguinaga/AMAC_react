-- Vacantes de ejemplo.
-- Se publican a nombre de la primera empresa registrada.
insert into public.vacantes
  (empresa_id, titulo, sueldo, ubicacion, horario, categoria, descripcion, requisitos, prestaciones, telefono_contacto)
select e.id, v.*
from (select id from public.perfiles where rol = 'empresa' order by creado_en limit 1) e,
(values
  ('Auxiliar de recepción', 8000, 'Centro, Monterrey', 'Matutino', 'Atención al cliente',
   'Recibir a las personas, contestar el teléfono y dar informes.', 'Trato amable y saber usar el teléfono.', 'Seguro social y capacitación.', '81 8765 4321'),
  ('Atención en tienda', 7500, 'Guadalupe', 'Medio tiempo', 'Comercio',
   'Atender clientes, acomodar mercancía y cobrar en caja.', 'Gusto por el trato con la gente.', 'Descuento en compras.', null),
  ('Apoyo administrativo', 9000, 'San Pedro', 'Vespertino', 'Administrativo',
   'Archivar documentos, capturar datos y apoyar al contador.', 'Saber usar computadora a nivel básico.', 'Seguro social y vales de despensa.', null),
  ('Recepcionista de hotel', 9500, 'Centro, Monterrey', 'Matutino', 'Atención al cliente',
   'Registrar huéspedes y resolver dudas.', 'Experiencia en atención al público.', 'Comidas y seguro social.', null),
  ('Guía de museo', 6500, 'Monterrey', 'Fines de semana', 'Servicios',
   'Acompañar a los visitantes y explicar las salas.', 'Buena comunicación y paciencia.', 'Entradas gratis para familiares.', null),
  ('Acompañante de adultos mayores', 8500, 'San Nicolás', 'Medio tiempo', 'Cuidado y apoyo',
   'Acompañar a personas mayores en actividades del día.', 'Paciencia y buen trato.', 'Capacitación pagada.', null)
) as v(titulo, sueldo, ubicacion, horario, categoria, descripcion, requisitos, prestaciones, telefono_contacto);
