import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://uwgiwfihcjqploxzvwff.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3Z2l3ZmloY2pxcGxveHp2d2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNzg4MDIsImV4cCI6MjA0ODc1NDgwMn0.h81YQRCLLh30y2TMyO21a-bv6QFFJ2v6cZY1LCRrqko"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)