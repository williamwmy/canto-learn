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

  console.log(`API_KEY exists: ${!!API_KEY}`)
  console.log(`API_SECRET exists: ${!!API_SECRET}`)
  
  if (!API_KEY || !API_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API credentials not configured' })
    }
  }

  try {
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')
    
    // Try the original v1 API endpoint which might work better
    const url = `https://api.thenounproject.com/icons/${encodeURIComponent(searchTerm)}?limit=1`
    
    console.log(`Fetching icon for: ${searchTerm}`)
    console.log(`URL: ${url}`)
    console.log(`Auth header: Basic ${auth.substring(0, 10)}...`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'User-Agent': 'Canto-Learn-App/1.0'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API request failed: ${response.status} - ${errorText}`)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    let iconUrl = null
    
    if (data.icons && data.icons.length > 0) {
      iconUrl = data.icons[0].preview_url || data.icons[0].icon_url
    } else if (data.icon) {
      iconUrl = data.icon.preview_url || data.icon.icon_url
    }
    
    if (iconUrl) {
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