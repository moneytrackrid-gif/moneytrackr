import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-scalev-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()
    const event = body.event
    const data = body.data

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SERVICE_ROLE_KEY')!
    )

    const email = data?.customer?.email || data?.buyer_email || data?.email
    if (!email) return new Response(JSON.stringify({ message: 'no email' }), { headers: corsHeaders })

    if (['payment.received', 'subscription.activated', 'subscription.renewed', 'order.payment_status_changed'].includes(event)) {
      // Simpan email ke paid_emails
      await supabase.from('paid_emails').upsert({ email }).eq('email', email)

      // Cek apakah user sudah ada
      const { data: { users } } = await supabase.auth.admin.listUsers()
      const user = users.find(u => u.email === email)

      if (user) {
        // Aktifkan subscription
        const expiredAt = new Date()
        expiredAt.setMonth(expiredAt.getMonth() + 3)
        await supabase.from('profiles').update({
          subscription_status: 'active',
          plan: 'pro',
          subscription_expires_at: expiredAt.toISOString(),
        }).eq('id', user.id)
      }
    }

    if (['subscription.canceled', 'subscription.expired'].includes(event)) {
      const { data: { users } } = await supabase.auth.admin.listUsers()
      const user = users.find(u => u.email === email)
      if (user) {
        await supabase.from('profiles').update({
          subscription_status: 'inactive',
        }).eq('id', user.id)
      }
      // Hapus dari paid_emails
      await supabase.from('paid_emails').delete().eq('email', email)
    }

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
