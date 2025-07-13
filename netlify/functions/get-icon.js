export const handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const { searchTerm } = event.queryStringParameters || {}
  
  if (!searchTerm) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'searchTerm parameter is required' })
    }
  }

  const API_KEY = process.env.NOUN_PROJECT_KEY
  const API_SECRET = process.env.NOUN_PROJECT_SECRET

  if (!API_KEY || !API_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API credentials not configured' })
    }
  }

  try {
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')
    
    const response = await fetch(`https://api.thenounproject.com/icons/${encodeURIComponent(searchTerm)}?limit=1`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.icons && data.icons.length > 0) {
      const iconUrl = data.icons[0].preview_url || data.icons[0].icon_url
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ iconUrl })
      }
    }
    
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'No icon found' })
    }
  } catch (error) {
    console.error('Error fetching icon:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch icon' })
    }
  }
}