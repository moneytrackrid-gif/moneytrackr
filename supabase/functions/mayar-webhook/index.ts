import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-requested-with, content-type, x-mayar-signature',
}

async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(payload)
  const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
  const computed = Array.from(new Uint8Array(signatureBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
  return computed === signature
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const rawBody = await req.text()
    const payload = JSON.parse(rawBody)

    const signature = req.headers.get('x-mayar-signature') ?? ''
    const webhookSecret = Deno.env.get('MAYAR_WEBHOOK_SECRET') ?? ''
    if (webhookSecret && signature) {
      const valid = await verifySignature(rawBody, signature, webhookSecret)
      if (!valid) return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const validEvents = ['payment.success', 'subscription.active', 'subscription.paid', 'new_membership']
    if (!validEvents.includes(payload.event)) {
      return new Response(JSON.stringify({ message: 'Event ignored' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const customerEmail = payload.data?.customer?.email ?? payload.data?.payer?.email ?? payload.data?.customerEmail ?? payload.data?.email
    const orderId = payload.data?.id ?? payload.data?.order_id

    if (!customerEmail) return new Response(JSON.stringify({ error: 'No customer email found' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 90)

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        subscription_end_date: expiresAt.toISOString(),
        mayar_order_id: orderId ?? null
      })
      .eq('email', customerEmail)

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    console.log(`✅ Activated: ${customerEmail} until ${expiresAt.toISOString()}`)
    return new Response(JSON.stringify({ success: true, email: customerEmail }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
