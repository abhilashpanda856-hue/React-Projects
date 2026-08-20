import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eivrokdpfuyazjrpvbcj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdnJva2RwZnV5YXpqcnB2YmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MTA5ODUsImV4cCI6MjEwMjM4Njk4NX0.K_LQU0BWY_DUNoR06tgPoXrrCRMFNyrIoWFj9XjEWeE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const email = `test_${Math.random().toString(36).substring(7)}@example.com`;
  const password = 'Password123!';

  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
  
  if (authError) {
    console.error("Auth error:", authError);
    return;
  }
  
  const user = authData.user;

  // Try insert with extra fields to check if columns exist
  const testAnime = {
    user_id: user.id,
    mal_id: 99999,
    title: 'Test Dummy Anime',
    status: 'watching',
    episodes_watched: 0,
    image: 'http://example.com/image.jpg',
    image_url: 'http://example.com/image.jpg',
    episodes: 12,
    rating: 8,
    rewatches: 2
  };

  const { data: insertData, error: insertError } = await supabase
    .from('tracked_anime')
    .insert([testAnime])
    .select();

  console.log("Insert response with extra fields:", { insertData, insertError });

  await supabase.from('tracked_anime').delete().eq('mal_id', 99999);
}

check();
