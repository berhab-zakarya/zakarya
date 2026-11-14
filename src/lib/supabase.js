import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/** Null when the Supabase environment variables are missing, so the page can still render. */
export const supabase = url && key ? createClient(url, key) : null;
