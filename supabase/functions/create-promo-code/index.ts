// Supabase Edge Function: create-promo-code
// Verifies the caller is an admin via the CheckIsAdmin function,
// then inserts a new promo code into the promo_codes table.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Extract the user's JWT token from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const token = authHeader.replace("Bearer ", "");

    // 2. Parse the request body for promo code fields + user email
    const body = await req.json();
    const { email, code, discount, type, max_uses, expiry, is_active } = body;

    if (!email || !code || discount === undefined || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, code, discount, type." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Verify the caller is an admin — call the existing CheckIsAdmin edge function
    const adminCheckResponse = await fetch(
      `${SUPABASE_URL}/functions/v1/CheckIsAdmin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!adminCheckResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to verify admin status." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { isAdmin } = await adminCheckResponse.json();

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Only admins can create promo codes." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Admin verified — insert the promo code using the service role (bypasses RLS)
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await adminClient
      .from("promo_codes")
      .insert({
        code: code.trim().toUpperCase(),
        discount: Number(discount),
        type,
        max_uses: max_uses ?? 0,
        expiry: expiry ?? null,
        is_active: is_active ?? true,
        used: false,
        used_by_user_ids: [],
      })
      .select()
      .single();

    if (error) {
      // Handle unique code constraint violation
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({ error: `Promo code "${code.toUpperCase()}" already exists.` }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Success — return the newly created promo code
    return new Response(
      JSON.stringify({ success: true, promoCode: data }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error.", detail: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
