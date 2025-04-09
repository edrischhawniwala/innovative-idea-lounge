
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
      // Create sample post data for demonstration
      const samplePosts = [
        {
          id: crypto.randomUUID(),
          user_id: user_id_param,
          content: "This is a sample post for demonstration purposes. In a real app, this data would come from the database.",
          likes_count: Math.floor(Math.random() * 25),
          comments_count: Math.floor(Math.random() * 10),
          created_at: new Date().toISOString(),
          images: ["https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"],
          videos: null,
          tags: ["demo", "sample"]
        },
        {
          id: crypto.randomUUID(),
          user_id: user_id_param,
          content: "Another sample post. This one doesn't have any images attached to it.",
          likes_count: Math.floor(Math.random() * 15),
          comments_count: Math.floor(Math.random() * 5),
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          images: null,
          videos: null,
          tags: ["text", "noimage"]
        }
      ];

      // Get the profile to combine with sample posts
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user_id_param)
        .single();

      if (profileError) {
        return new Response(
          JSON.stringify({ error: 'Profile not found' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404
          }
        );
      }

      // Combine post data with profile data
      const transformedData = samplePosts.map(post => ({
        ...post,
        profile_id: profile.id,
        username: profile.username,
        avatar: profile.avatar,
        role: profile.role
      }));

      return new Response(
        JSON.stringify(transformedData),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
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
