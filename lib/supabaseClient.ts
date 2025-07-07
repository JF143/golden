import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pensgocntbhhxhkhsksx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbnNnb2NudGJoaHhoa2hza3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjQyNjUsImV4cCI6MjA2NzMwMDI2NX0.gQVXfIPCRkJLIDEifwI-xGO1xLDRXeDL3R7TbSLwwlw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey);
console.log("Vercel env check:", supabaseUrl, supabaseAnonKey);