
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

    // First check if the posts table exists
    const { data: tableExists, error: checkTableError } = await supabase
      .rpc('check_table_exists', { table_name: 'posts' })

    if (checkTableError) {
      return new Response(
        JSON.stringify({ error: 'Error checking table existence', details: checkTableError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    // If table doesn't exist, return an appropriate response
    if (!tableExists) {
      return new Response(
        JSON.stringify({ error: 'Posts table does not exist yet' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      )
    }

    // Get posts with joined profile data using REST API directly
    const response = await fetch(
      `${url}/rest/v1/posts?user_id=eq.${user_id_param}&order=created_at.desc`,
      {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      }
    )
    
    const posts = await response.json()
    
    if (!Array.isArray(posts)) {
      throw new Error('Invalid response format')
    }
    
    // Fetch profile data for each post
    const profileResponse = await fetch(
      `${url}/rest/v1/profiles?id=eq.${user_id_param}`,
      {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      }
    )
    
    const profiles = await profileResponse.json()
    
    if (!Array.isArray(profiles) || profiles.length === 0) {
      throw new Error('Profile not found')
    }
    
    const profile = profiles[0]
    
    // Combine post data with profile data
    const transformedData = posts.map(post => ({
      ...post,
      profile_id: profile.id,
      username: profile.username,
      avatar: profile.avatar,
      role: profile.role
    }))

    return new Response(
      JSON.stringify(transformedData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in edge function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
