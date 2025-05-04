// src/app/utils/supabase/client.ts
import { createClient } from "@supabase/supabase-js";


const SUPABASE_URL = "https://asbxskjthncdxiwkdkqq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYnhza2p0aG5jZHhpd2tka3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5Mjk3MzUsImV4cCI6MjA2MTUwNTczNX0.Ef3Pp61AYyQRFPEH0dW5c4AZs2IYXESJI5NXASow9A8";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
