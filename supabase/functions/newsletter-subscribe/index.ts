import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405)

  try {
    const { email = '' } = await request.json()
    const normalizedEmail = String(email).trim().toLowerCase()

    if (!emailPattern.test(normalizedEmail) || normalizedEmail.length > 320) {
      return jsonResponse({ error: 'Email không hợp lệ.' }, 400)
    }

    const serverKey =
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SECRET_KEY')
    if (!serverKey) throw new Error('Missing Supabase server key')

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serverKey)
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email: normalizedEmail }, { onConflict: 'email', ignoreDuplicates: true })

    if (error) throw error
    return jsonResponse({ subscribed: true })
  } catch (error) {
    console.error(error)
    return jsonResponse({ error: 'Không thể đăng ký nhận tin lúc này.' }, 500)
  }
})
