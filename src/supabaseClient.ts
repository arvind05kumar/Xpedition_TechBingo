import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gpphvqxiruyytlgnzlgw.supabase.co'  // replace with your Project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcGh2cXhpcnV5eXRsZ256bGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTgzNzAsImV4cCI6MjA2OTk5NDM3MH0.dSHTNsvHMRbvs2sPwkU5uHcjavq6Lx3-FUg02ZjjR3U'  // replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseKey)
