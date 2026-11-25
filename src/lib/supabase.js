import { createClient } from "@supabase/supabase-js"

// La publishable key puede ir en el navegador: la protección real la hacen las políticas RLS.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)
