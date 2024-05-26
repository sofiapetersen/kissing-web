const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    "https://pygqirmwmklcmhbgflgp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5Z3Fpcm13bWtsY21oYmdmbGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0ODU2NzcsImV4cCI6MjAzMjA2MTY3N30.XwgiRamAuySwqx6EvvWam8i9_EvG4aW2PUTEXeMZWfQ"
);

module.exports = supabase;
