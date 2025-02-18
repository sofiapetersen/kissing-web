const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    "https://pygqirmwmklcmhbgflgp.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwamNra2h5cXBscWVmbGx4dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTEwNjYsImV4cCI6MjA1NTQ2NzA2Nn0.y0qYT1dz2WATlBXOWONJs6zhDN8Ch2vomMZ6nhqb8-o"
);

module.exports = supabase;
