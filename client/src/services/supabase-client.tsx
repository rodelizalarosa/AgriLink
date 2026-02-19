import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://osgogrbrjlnslgdinhgl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zZ29ncmJyamxuc2xnZGluaGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1Mjg4NjcsImV4cCI6MjA4NjEwNDg2N30._ylRyGjS8IFW6MQuNkyAHx-JsxXXv3dJ1I0fkwrDTAs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);