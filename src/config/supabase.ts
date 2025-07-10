import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kmptnrydjdonpcztarbi.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttcHRucnlkamRvbnBjenRhcmJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjY3NTksImV4cCI6MjA2NzY0Mjc1OX0.OPo1JyZ2vya92qTIFkVn-1igeqdSEGoS2O213NxiRUg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
