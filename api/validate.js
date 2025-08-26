import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { key } = req.query

  if (!key) {
    return res.status(400).json({ 
      status: 'INVALID', 
      message: 'Key is required' 
    })
  }

  try {
    // Get key from Supabase
    const { data, error } = await supabase
      .from('keys')
      .select('*')
      .eq('key', key)
      .single()

    if (error || !data) {
      // Key not found in database
      return res.status(200).json({ 
        status: 'INVALID' 
      })
    }

    // Check if key is expired
    const now = new Date()
    const expiresAt = new Date(data.expires_at)

    if (now > expiresAt) {
      return res.status(200).json({ 
        status: 'EXPIRED' 
      })
    }

    // Key is valid and not expired
    res.status(200).json({ 
      status: 'VALID',
      expires: data.expires_at
    })

  } catch (error) {
    console.error('Validate API error:', error)
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Internal server error' 
    })
  }
  }
