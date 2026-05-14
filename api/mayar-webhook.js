import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const payload = req.body
    const validEvents = ['payment.success', 'subscription.active', 'subscription.paid', 'new_membership']
    
    if (!validEvents.includes(payload.event)) {
      return res.status(200).json({ message: 'Event ignored' })
    }

    const customerEmail = payload.data?.customer?.email 
      ?? payload.data?.customerEmail 
      ?? payload.data?.email

    if (!customerEmail) return res.status(400).json({ error: 'No customer email' })

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 90)

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        subscription_end_date: expiresAt.toISOString(),
        mayar_order_id: payload.data?.id ?? null
      })
      .eq('email', customerEmail)

    if (error) return res.status(500).json({ error: error.message })

    return res.status(200).json({ success: true, email: customerEmail })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
