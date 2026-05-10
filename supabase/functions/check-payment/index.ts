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

    const cleanEmail = email.trim().toLowerCase()

    const { data: allPaid } = await supabase.from('paid_emails').select('email')
    const paidEmail = allPaid?.find(p => p.email.trim().toLowerCase() === cleanEmail)

    const { data: { users } } = await supabase.auth.admin.listUsers()
    const user = users.find(u => u.email?.toLowerCase() === cleanEmail)

    if (!user) {
      return new Response(JSON.stringify({ paid: !!paidEmail, isNewUser: true }), { headers: corsHeaders })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single()

    const paid = profile?.subscription_status === 'active' || !!paidEmail
    return new Response(JSON.stringify({ paid, isNewUser: false }), { headers: corsHeaders })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
