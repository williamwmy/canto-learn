const API_KEY = import.meta.env.VITE_NOUN_PROJECT_KEY
const API_SECRET = import.meta.env.VITE_NOUN_PROJECT_SECRET

const iconCache = new Map()

export const getIconUrl = async (searchTerm) => {
  if (iconCache.has(searchTerm)) {
    return iconCache.get(searchTerm)
  }

  // Try Netlify function first (works in production)
  try {
    const response = await fetch(`/.netlify/functions/get-icon?searchTerm=${encodeURIComponent(searchTerm)}`)
    
    if (response.ok) {
      const data = await response.json()
      if (data.iconUrl) {
        iconCache.set(searchTerm, data.iconUrl)
        return data.iconUrl
      }
    }
  } catch (error) {
    console.log('Netlify function not available, trying direct API call')
  }

  // Fallback to direct API call (for local development with credentials)
  if (API_KEY && API_SECRET) {
    try {
      const auth = btoa(`${API_KEY}:${API_SECRET}`)
      
      const response = await fetch(`https://api.thenounproject.com/icons/${encodeURIComponent(searchTerm)}?limit=1`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.icons && data.icons.length > 0) {
          const iconUrl = data.icons[0].preview_url || data.icons[0].icon_url
          iconCache.set(searchTerm, iconUrl)
          return iconUrl
        }
      }
    } catch (error) {
      console.error('Error fetching icon:', error)
    }
  }

  // Final fallback to emoji
  return getFallbackIcon(searchTerm)
}

const getFallbackIcon = (searchTerm) => {
  const fallbackIcons = {
    'thank you': '🙏',
    'yes': '✅',
    'no': '❌',
    'sorry': '😔',
    'hello': '👋',
    'goodbye': '👋',
    'good': '👍',
    'bad': '👎',
    'maybe': '🤔',
    'confused': '😕',
    'ok': '👌',
    'stop': '✋',
    'eat': '🍽️',
    'drink': '💧',
    'sleep': '😴',
    'work': '💼',
    'run': '🏃',
    'read': '📖',
    'walk': '🚶',
    'wake up': '⏰',
    'home': '🏠',
    'school': '🏫',
    'shop': '🛒',
    'park': '🌳',
    'hospital': '🏥',
    'church': '⛪',
    'car': '🚗',
    'boat': '⛵',
    'airplane': '✈️',
    'train': '🚂',
    'money': '💰',
    'book': '📚',
    'phone': '📱',
    'key': '🔑',
    'computer': '💻',
    'television': '📺',
    'radio': '📻',
    'delicious': '😋',
    'hot': '🔥',
    'cold': '❄️',
    'sour': '😝',
    'wet': '💧',
    'dry': '☀️',
    'mild': '🌤️',
    'cool': '😎',
    'big': '🦣',
    'small': '🐭',
    'medium': '📏',
    'tall': '📏',
    'long': '📏',
    'short': '📏',
    'fast': '💨',
    'slow': '🐌',
    'go': '➡️',
    'normal': '😐',
    'pause': '⏸️',
    'dog': '🐕',
    'cat': '🐱',
    'bird': '🐦',
    'fish': '🐟',
    'mouse': '🐭',
    'rabbit': '🐰',
    'rain': '🌧️',
    'sun': '☀️',
    'snow': '❄️',
    'wind': '💨',
    'moon': '🌙',
    'star': '⭐',
    'cloud': '☁️',
    'red': '🔴',
    'blue': '🔵',
    'green': '🟢',
    'yellow': '🟡',
    'black': '⚫',
    'white': '⚪',
    'one': '1️⃣',
    'two': '2️⃣',
    'three': '3️⃣',
    'four': '4️⃣',
    'five': '5️⃣',
    'six': '6️⃣',
    'nine': '9️⃣',
    'ten': '🔟',
    'twelve': '🔢',
    'love': '❤️',
    'hate': '💔',
    'happy': '😊',
    'sad': '😢'
  }
  
  return fallbackIcons[searchTerm] || '❓'
}