import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405)

  try {
    const { customer = {}, items = [] } = await request.json()
    const name = String(customer.name ?? '').trim()
    const email = String(customer.email ?? '').trim().toLowerCase()
    const phone = String(customer.phone ?? '').trim()

    if (name.length < 2 || name.length > 120) {
      return jsonResponse({ error: 'Tên khách hàng không hợp lệ.' }, 400)
    }
    if (!emailPattern.test(email) || email.length > 320) {
      return jsonResponse({ error: 'Email không hợp lệ.' }, 400)
    }
    if (!Array.isArray(items) || !items.length || items.length > 50) {
      return jsonResponse({ error: 'Giỏ hàng không hợp lệ.' }, 400)
    }

    const serverKey =
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SECRET_KEY')
    if (!serverKey) throw new Error('Missing Supabase server key')

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serverKey)
    const { data, error } = await supabase.rpc('create_storefront_order', {
      p_customer_name: name,
      p_customer_email: email,
      p_customer_phone: phone || null,
      p_items: items,
    })

    if (error) {
      console.error(error)
      return jsonResponse({ error: 'Không thể tạo đơn hàng. Hãy kiểm tra tồn kho và thử lại.' }, 400)
    }

    return jsonResponse(data[0], 201)
  } catch (error) {
    console.error(error)
    return jsonResponse({ error: 'Không thể tạo đơn hàng lúc này.' }, 500)
  }
})
