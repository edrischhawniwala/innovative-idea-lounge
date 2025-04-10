
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
    let user_id_param = null
    
    try {
      const body = await req.json()
      user_id_param = body.user_id_param
    } catch (e) {
      // If no body or invalid JSON, proceed without user_id_param
      console.log("No request body or invalid JSON. Will fetch all posts.")
    }

    let postsQuery = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    // If user_id_param is provided, filter posts for that user
    if (user_id_param) {
      postsQuery = postsQuery.eq('user_id', user_id_param)
    }
    
    // Get posts
    const { data: posts, error: postsError } = await postsQuery
    
    if (postsError) {
      console.error("Error fetching posts:", postsError)
      return new Response(
        JSON.stringify({ error: 'Error fetching posts', details: postsError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }
    
    if (!posts || posts.length === 0) {
      console.log("No posts found")
      return new Response(
        JSON.stringify([]),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }
    
    // Get all the unique user IDs from the posts
    const userIds = [...new Set(posts.map(post => post.user_id))]
    
    // Fetch profiles for all these users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds)
    
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
      return new Response(
        JSON.stringify({ error: 'Error fetching profiles', details: profilesError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }
    
    // Create a map of user_id to profile
    const profileMap = {}
    if (profiles) {
      profiles.forEach(profile => {
        profileMap[profile.id] = profile
      })
    }
    
    // Combine post data with profile data
    const transformedData = posts.map(post => {
      const profile = profileMap[post.user_id]
      return {
        ...post,
        profile_id: profile?.id || post.user_id,
        username: profile?.username || 'unknown',
        avatar: profile?.avatar || null,
        role: profile?.role || 'member'
      }
    })

    console.log(`Returning ${transformedData.length} posts`)
    
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
