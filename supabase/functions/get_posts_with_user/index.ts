
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.41.1'

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
    const url = Deno.env.get('SUPABASE_URL') || ''
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(url, key)

    // Parse the request body
    const { user_id_param } = await req.json()

    if (!user_id_param) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id_param' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Get posts with joined profile data
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        user_id,
        content,
        images,
        videos,
        created_at,
        likes_count,
        comments_count,
        tags,
        profiles:user_id (
          id as profile_id,
          username,
          avatar,
          role,
          created_at
        )
      `)
      .eq('user_id', user_id_param)
      .order('created_at', { ascending: false })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    // Transform data to flatten the profiles object
    const transformedData = data.map((post) => {
      const profile = post.profiles
      delete post.profiles
      return {
        ...post,
        ...profile
      }
    })

    return new Response(
      JSON.stringify(transformedData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
