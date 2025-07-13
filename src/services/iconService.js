const iconCache = new Map()

export const getIconUrl = async (searchTerm) => {
  if (iconCache.has(searchTerm)) {
    return iconCache.get(searchTerm)
  }

  // Try Netlify function for API icons
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
    console.log('Netlify function not available, using emoji fallback')
  }

  // Fallback to emoji
  const iconUrl = getFallbackIcon(searchTerm)
  iconCache.set(searchTerm, iconUrl)
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
    'sad': '😢'
  }
  
  return fallbackIcons[searchTerm] || '❓'
}