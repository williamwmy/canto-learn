// Persistent icon cache using localStorage
const CACHE_KEY = 'cantolingo-icons'
const CACHE_EXPIRY_KEY = 'cantolingo-icons-expiry'
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

function getIconCache() {
  try {
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY)
    if (!expiry || Date.now() > parseInt(expiry)) {
      // Cache expired, clear it
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(CACHE_EXPIRY_KEY)
      return {}
    }
    
    const cached = localStorage.getItem(CACHE_KEY)
    return cached ? JSON.parse(cached) : {}
  } catch (error) {
    console.error('Error reading icon cache:', error)
    return {}
  }
}

function setIconCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString())
  } catch (error) {
    console.error('Error saving icon cache:', error)
  }
}

export const getIconUrl = async (searchTerm) => {
  const cache = getIconCache()
  
  if (cache[searchTerm]) {
    console.log(`Using cached icon for: ${searchTerm}`)
    return cache[searchTerm]
  }

  // Try Netlify function with OAuth for API icons
  try {
    const response = await fetch(`/.netlify/functions/get-icon?searchTerm=${encodeURIComponent(searchTerm)}`)
    
    if (response.ok) {
      const data = await response.json()
      if (data.iconUrl) {
        // Cache the API icon
        cache[searchTerm] = data.iconUrl
        setIconCache(cache)
        console.log(`Cached API icon for: ${searchTerm}`)
        return data.iconUrl
      }
    }
  } catch (error) {
    console.log('Netlify function not available, using emoji fallback')
  }

  // Fallback to emoji
  const iconUrl = getFallbackIcon(searchTerm)
  cache[searchTerm] = iconUrl
  setIconCache(cache)
  return iconUrl
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
    'sad': '😢',
    'breakfast': '🍳',
    'lunch': '🥪',
    'dinner': '🍽️',
    'coffee': '☕',
    'friend': '👫',
    'family': '👨‍👩‍👧‍👦',
    'teacher': '👨‍🏫',
    'stranger': '🚶',
    'shopping': '🛒',
    'sell': '💰',
    'borrow': '🤝',
    'give': '🎁',
    'bicycle': '🚲',
    'drive': '🚗',
    'music': '🎵',
    'game': '🎮',
    'wash': '🧼',
    'brush teeth': '🦷',
    'shower': '🚿',
    'dress': '👕',
    'undress': '👔',
    'laundry': '👕',
    'angry': '😠',
    'scared': '😨',
    'hungry': '🍽️',
    'full': '😋',
    'thirsty': '💧',
    'tired': '😴',
    'energetic': '⚡',
    'awake': '👁️',
    'sick': '🤒',
    'healthy': '💪',
    'strong': '💪',
    'weak': '😵',
    'weather': '🌤️',
    'temperature': '🌡️',
    'season': '🍂',
    'climate': '🌍',
    'time': '⏰',
    'clock': '🕐',
    'date': '📅',
    'calendar': '📆',
    'today': '📅',
    'tomorrow': '➡️',
    'yesterday': '⬅️',
    'now': '⚡',
    'next week': '📅',
    'last week': '📅',
    'morning': '🌅',
    'afternoon': '☀️',
    'evening': '🌆',
    'night': '🌙',
    'tea': '🍵',
    'beer': '🍺',
    'juice': '🧃',
    'exit': '🚪',
    'mother': '👩',
    'father': '👨',
    'grandmother': '👵',
    'grandfather': '👴',
    'aunt': '👩‍🦳',
    'uncle': '👨‍🦳',
    'toy': '🧸',
    'doll': '🪆',
    'ball': '⚽',
    'drawing': '🎨',
    'writing': '✏️',
    'play': '🎮',
    'singing': '🎤',
    'dancing': '💃',
    'jumping': '🤸',
    'running': '🏃',
    'walking': '🚶',
    'sitting': '🪑',
    'candy': '🍭',
    'cake': '🎂',
    'ice cream': '🍦',
    'fruit': '🍎',
    'birthday': '🎂',
    'christmas': '🎄',
    'party': '🎉',
    'gift': '🎁',
    'flower': '🌸',
    'tree': '🌳',
    'grass': '🌱',
    'leaf': '🍃',
    'bush': '🌿',
    'butterfly': '🦋',
    'bee': '🐝',
    'ant': '🐜',
    'fly': '🪰',
    'spider': '🕷️',
    'laugh': '😂',
    'cry': '😭',
    'smile': '😊',
    'talk': '💬',
    'shout': '📢',
    'whisper': '🤫',
    'rainbow': '🌈',
    'swimming': '🏊',
    'bathing': '🛁',
    'cycling': '🚴'
  }
  
  return fallbackIcons[searchTerm] || '❓'
}