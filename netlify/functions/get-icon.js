import crypto from 'crypto'

// OAuth 1.0a signature generation
function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret = '') {
  // Create parameter string
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
  
  // Create signature base string
  const signatureBaseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams)
  ].join('&')
  
  // Create signing key
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`
  
  // Generate signature
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64')
  
  return signature
}

function generateOAuthHeader(method, url, consumerKey, consumerSecret) {
  return generateOAuthHeaderWithParams(method, url, {}, consumerKey, consumerSecret)
}

function generateOAuthHeaderWithParams(method, url, queryParams, consumerKey, consumerSecret) {
  const timestamp = Math.floor(Date.now() / 1000)
  const nonce = crypto.randomBytes(16).toString('hex')
  
  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_version: '1.0'
  }
  
  // Combine OAuth params with query params for signature generation
  const allParams = { ...oauthParams, ...queryParams }
  
  // Generate signature
  const signature = generateOAuthSignature(method, url, allParams, consumerSecret)
  oauthParams.oauth_signature = signature
  
  // Create OAuth header (only OAuth params, not query params)
  const oauthHeader = 'OAuth ' + Object.keys(oauthParams)
    .map(key => `${key}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ')
  
  return oauthHeader
}

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

  const CONSUMER_KEY = process.env.NOUN_PROJECT_KEY
  const CONSUMER_SECRET = process.env.NOUN_PROJECT_SECRET

  console.log(`CONSUMER_KEY exists: ${!!CONSUMER_KEY}`)
  console.log(`CONSUMER_SECRET exists: ${!!CONSUMER_SECRET}`)
  
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API credentials not configured' })
    }
  }

  try {
    // Use only v2 endpoint since it works
    const baseUrl = 'https://api.thenounproject.com/v2/icon'
    
    const queryParams = new URLSearchParams({
      query: searchTerm,
      limit: '1'
    })
    const fullUrl = `${baseUrl}?${queryParams.toString()}`
    
    console.log(`Fetching icon for: ${searchTerm}`)
    console.log(`Full URL: ${fullUrl}`)
    
    // Important: OAuth signature must be generated with query parameters included
    const allParams = {
      query: searchTerm,
      limit: '1'
    }
    
    const authHeader = generateOAuthHeaderWithParams('GET', baseUrl, allParams, CONSUMER_KEY, CONSUMER_SECRET)
    console.log(`OAuth header generated`)
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'User-Agent': 'Canto-Learn-App/1.0'
      }
    })
    
    console.log(`Response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API request failed: ${response.status} - ${errorText}`)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log(`API Response:`, JSON.stringify(data, null, 2))
    
    let iconUrl = null
    
    // Handle different response formats from API
    if (data.icons && data.icons.length > 0) {
      const icon = data.icons[0]
      iconUrl = icon.thumbnail_url || icon.preview_url || icon.icon_url
      console.log(`Found icon in icons array: ${iconUrl}`)
    } else if (data.icon) {
      iconUrl = data.icon.thumbnail_url || data.icon.preview_url || data.icon.icon_url
      console.log(`Found icon in icon object: ${iconUrl}`)
    } else if (data.thumbnail_url) {
      iconUrl = data.thumbnail_url
      console.log(`Found direct thumbnail_url: ${iconUrl}`)
    } else if (data.preview_url) {
      iconUrl = data.preview_url
      console.log(`Found direct preview_url: ${iconUrl}`)
    } else if (data.icon_url) {
      iconUrl = data.icon_url
      console.log(`Found direct icon_url: ${iconUrl}`)
    }
    
    if (iconUrl) {
      console.log(`Returning icon URL: ${iconUrl}`)
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ iconUrl })
      }
    } else {
      console.log(`No icon found in response`)
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