import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    // 1. Validar o usuário logado via Bearer token
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Não autorizado: Sessão inválida ou expirada.')
    }

    // 2. Verificar permissões (admin ou can_create_users)
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role, can_create_users')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Erro ao verificar permissões do usuário.')
    }

    if (profile.role !== 'admin' && !profile.can_create_users) {
      throw new Error('Acesso negado: Você não tem permissão para criar usuários.')
    }

    // 3. Criar usuário usando Service Role Key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    const { nome, email, password, role, ...permissions } = await req.json()

    console.log(`[Edge Function] Creating user: ${email}`)

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { 
        nome, 
        role,
        ...permissions 
      }
    })

    if (authError) throw authError

    // 4. Garantir que o perfil seja salvo/atualizado
    const { error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: authData.user.id,
        nome,
        email,
        role,
        ...permissions,
        updated_at: new Date().toISOString()
      })

    if (upsertError) throw upsertError

    return new Response(
      JSON.stringify({ success: true, user: authData.user }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('[Edge Function] Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
