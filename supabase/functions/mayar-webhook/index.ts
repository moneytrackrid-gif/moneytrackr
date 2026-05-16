import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-requested-with, content-type, x-mayar-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const payload = await req.json()

    const validEvents = ['payment.success', 'subscription.active', 'subscription.paid', 'new_membership']
    if (!validEvents.includes(payload.event)) {
      return new Response(JSON.stringify({ message: 'Event ignored' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const customerEmail = payload.data?.customer?.email ?? payload.data?.customerEmail ?? payload.data?.email
    const orderId = payload.data?.id ?? null

    if (!customerEmail) return new Response(JSON.stringify({ error: 'No email' }), { status: 400, headers: corsHeaders })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 90)

    // Cek apakah user sudah ada via listUsers filter
    const { data: listData } = await supabase.auth.admin.listUsers()
    const existingUser = listData?.users?.find(u => u.email === customerEmail)

    if (existingUser) {
      // Sudah ada akun → update plan langsung
      await supabase.from('profiles').update({
        plan: 'pro',
        subscription_end: expiresAt.toISOString(),
        mayar_order_id: orderId
      }).eq('id', existingUser.id)
    } else {
      // Belum ada akun → buat akun baru
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        email_confirm: true,
        user_metadata: { plan: 'pro' }
      })

      if (createError) throw createError

      if (newUser?.user) {
        await supabase.from('profiles').upsert({
          id: newUser.user.id,
          plan: 'pro',
          subscription_end: expiresAt.toISOString(),
          mayar_order_id: orderId
        })
      }
    }

    return new Response(JSON.stringify({ success: true, email: customerEmail }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Internal server error', detail: err.message }), { status: 500, headers: corsHeaders })
  }
})
