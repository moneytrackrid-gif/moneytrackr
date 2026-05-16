import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { email } = await req.json()
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const cleanEmail = email.trim().toLowerCase()
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const user = users.find(u => u.email?.toLowerCase() === cleanEmail)

    if (!user) {
      return new Response(JSON.stringify({ paid: false, isNewUser: true }), { headers: corsHeaders })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, subscription_end')
      .eq('id', user.id)
      .single()

    const isPro = profile?.plan === 'pro'
    const notExpired = profile?.subscription_end ? new Date(profile.subscription_end) > new Date() : false
    const paid = isPro && notExpired

    // Cek apakah user punya password atau dibuat webhook (no password)
    const hasPassword = user.identities && user.identities.length > 0

    return new Response(JSON.stringify({ 
      paid, 
      isNewUser: !hasPassword // true = perlu set password baru
    }), { headers: corsHeaders })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
