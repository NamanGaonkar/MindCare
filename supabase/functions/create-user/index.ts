import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { record } = await req.json();
  const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        user_id: record.id,
        full_name: record.raw_user_meta_data.full_name,
        email: record.email,
        student_id: record.raw_user_meta_data.student_id,
        university: record.raw_user_meta_data.university,
      },
    ]);

  if (error) {
    console.error("Error creating profile:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
});
