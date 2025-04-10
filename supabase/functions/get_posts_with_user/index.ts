
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
    let user_id_param
    
    try {
      const body = await req.json()
      user_id_param = body.user_id_param
    } catch (e) {
      // If no body or invalid JSON, proceed without user_id_param
      console.log("No request body or invalid JSON. Will fetch all posts.")
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
      console.log("Posts table doesn't exist")
      return new Response(
        JSON.stringify({ error: 'Posts table does not exist' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      )
    }

    let apiEndpoint = `${url}/rest/v1/posts?`
    
    // If user_id_param is provided, filter posts for that user
    if (user_id_param) {
      apiEndpoint += `user_id=eq.${user_id_param}&`
    }
    
    // Add sorting by creation date
    apiEndpoint += `order=created_at.desc`
    
    // Get posts using REST API directly
    const response = await fetch(
      apiEndpoint,
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
    
    // Get all the unique user IDs from the posts
    const userIds = [...new Set(posts.map(post => post.user_id))]
    
    // Fetch profiles for all these users
    const profilesResponse = await fetch(
      `${url}/rest/v1/profiles?id=in.(${userIds.join(',')})`,
      {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      }
    )
    
    const profiles = await profilesResponse.json()
    
    if (!Array.isArray(profiles)) {
      throw new Error('Invalid profiles response format')
    }
    
    // Create a map of user_id to profile
    const profileMap = {}
    profiles.forEach(profile => {
      profileMap[profile.id] = profile
    })
    
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
