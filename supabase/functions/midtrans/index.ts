import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname.split('/').pop()

  if (req.method === 'POST' && path === 'midtrans') {
    try {
      const orderId = `MT-${Date.now()}`
      const serverKey = Deno.env.get('MIDTRANS_SERVER_KEY')!
      const encodedKey = btoa(serverKey + ':')
      const payload = {
        transaction_details: { order_id: orderId, gross_amount: 147000 },
        item_details: [{ id: 'moneytrackr-3bulan', price: 147000, quantity: 1, name: 'moneytrackr - 3 Bulan' }]
      }
      const midtransRes = await fetch('https://app.midtrans.com/snap/v1/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${encodedKey}` },
        body: JSON.stringify(payload)
      })
      const midtransData = await midtransRes.json()
      return new Response(JSON.stringify(midtransData), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
    }
  }

  if (req.method === 'POST' && path === 'webhook') {
    try {
      const body = await req.json()
      const { transaction_status, fraud_status, custom_field1 } = body
      if ((transaction_status === 'capture' || transaction_status === 'settlement') && (fraud_status === 'accept' || !fraud_status)) {
        if (custom_field1) {
          const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
          const endDate = new Date()
          endDate.setMonth(endDate.getMonth() + 3)
          await supabase.from('profiles').update({ subscription_status: 'active', subscription_end_date: endDate.toISOString() }).eq('id', custom_field1)
        }
      }
      return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
    }
  }

  return new Response('Not found', { status: 404 })
})
