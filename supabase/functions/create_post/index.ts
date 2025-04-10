
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
    const { user_id, content, images, videos, tags } = await req.json()

    if (!user_id || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id and content' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Create the post directly without checking for table existence
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id,
        content,
        images: images || null,
        videos: videos || null,
        tags: tags || null
      })
      .select('*')
      .single()
      
    if (error) {
      console.error('Error creating post:', error)
      return new Response(
        JSON.stringify({ error: 'Error creating post', details: error.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }
    
    if (!data) {
      return new Response(
        JSON.stringify({ error: 'No data returned after post creation' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }
      
    // Get the profile to combine with the post
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single()
      
    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return new Response(
        JSON.stringify({ error: 'Profile not found', details: profileError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      )
    }

    // Combine post with profile data
    const enrichedPost = {
      ...data,
      profile_id: profile.id,
      username: profile.username,
      avatar: profile.avatar,
      role: profile.role
    }

    return new Response(
      JSON.stringify(enrichedPost),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201
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
