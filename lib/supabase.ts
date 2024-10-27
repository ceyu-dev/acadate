import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://llpqjmsimbaxrgqxwjzy.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxscHFqbXNpbWJheHJncXh3anp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0MzM0NjAsImV4cCI6MjA0NTAwOTQ2MH0.PMRe_YVVRYOp8HPA7rDpCup5dhuxh1XhHJ_DvMZZCTU";

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
