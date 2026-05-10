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
      Deno.env.get('SERVICE_ROLE_KEY')!
    )

    // Cek apakah user ada di auth
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const user = users.find(u => u.email === email)

    if (!user) {
      // User belum ada - cek apakah email ada di paid_emails table
      const { data: paidEmail } = await supabase
        .from('paid_emails')
        .select('email')
        .eq('email', email)
        .single()

      if (!paidEmail) {
        return new Response(JSON.stringify({ paid: false }), { headers: corsHeaders })
      }

      return new Response(JSON.stringify({ paid: true, isNewUser: true }), { headers: corsHeaders })
    }

    // User sudah ada - cek subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single()

    const paid = profile?.subscription_status === 'active'
    return new Response(JSON.stringify({ paid, isNewUser: false }), { headers: corsHeaders })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
