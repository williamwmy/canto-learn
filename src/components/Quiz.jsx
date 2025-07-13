import { useState, useEffect } from 'react'
import questionsData from '../data/questions.json'
import { getIconUrl } from '../services/iconService'
import './Quiz.css'

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [isCorrect, setIsCorrect] = useState(null)
  const [icons, setIcons] = useState({})
  const [shuffledAlternatives, setShuffledAlternatives] = useState([])
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0)

  const question = questionsData[currentQuestion]

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const speakCantonese = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Try to set Cantonese voice
      const voices = speechSynthesis.getVoices()
      const cantoneseVoice = voices.find(voice => 
        voice.lang.includes('zh-HK') || 
        voice.lang.includes('yue') ||
        voice.name.toLowerCase().includes('cantonese')
      )
      
      if (cantoneseVoice) {
        utterance.voice = cantoneseVoice
      } else {
        // Fallback to Chinese voice
        const chineseVoice = voices.find(voice => voice.lang.includes('zh'))
        if (chineseVoice) {
          utterance.voice = chineseVoice
        }
      }
      
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const handleAnswerClick = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    const correct = answerIndex === correctAnswerIndex
    setIsCorrect(correct)
    
    if (correct) {
      setScore(score + 1)
    }
    
    setTimeout(() => {
      if (currentQuestion < questionsData.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setIsCorrect(null)
      } else {
        setShowResult(true)
      }
    }, 1500)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setIsCorrect(null)
  }

  useEffect(() => {
    // Load voices
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices()
    }
    
    // Shuffle alternatives and find correct answer position
    const shuffled = shuffleArray(question.alternatives)
    setShuffledAlternatives(shuffled)
    
    // Find the index of the correct answer in the shuffled array
    const correctIndex = shuffled.findIndex(
      alt => alt.text === question.correct_answer.text
    )
    setCorrectAnswerIndex(correctIndex)
    
    // Load icons for current question
    const loadIcons = async () => {
      const newIcons = {}
      for (const alternative of shuffled) {
        try {
          newIcons[alternative.icon_search] = await getIconUrl(alternative.icon_search)
        } catch (error) {
          console.error('Error loading icon:', error)
          newIcons[alternative.icon_search] = getEmojiIcon(alternative.icon_search)
        }
      }
      setIcons(newIcons)
    }
    
    loadIcons()
  }, [currentQuestion])

  const getEmojiIcon = (searchTerm) => {
    const emojiIcons = {
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
    return emojiIcons[searchTerm] || '❓'
  }

  if (showResult) {
    return (
      <div className="quiz-result">
        <h2>Gratulerer! 🎉</h2>
        <p>Du fikk {score} av {questionsData.length} riktige!</p>
        <button onClick={resetQuiz} className="restart-btn">
          Prøv igjen
        </button>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>Lær kantonesisk</h1>
        <div className="progress">
          Spørsmål {currentQuestion + 1} av {questionsData.length}
        </div>
      </div>

      <div className="question-section">
        <div className="audio-section">
          <button 
            onClick={() => speakCantonese(question.tts_text)}
            className="play-button"
            aria-label="Spill av lyden"
          >
            🔊 Spill av
          </button>
          <div className="chinese-text">{question.tts_text}</div>
        </div>
      </div>

      <div className="answers-grid">
        {shuffledAlternatives.map((alternative, index) => (
          <button
            key={`${currentQuestion}-${index}`}
            onClick={() => handleAnswerClick(index)}
            disabled={selectedAnswer !== null}
            className={`answer-option ${
              selectedAnswer === index
                ? isCorrect
                  ? 'correct'
                  : 'incorrect'
                : ''
            }`}
          >
            <div className="answer-icon">
              {typeof icons[alternative.icon_search] === 'string' && icons[alternative.icon_search].startsWith('http') ? (
                <img 
                  src={icons[alternative.icon_search]} 
                  alt={alternative.text}
                  className="icon-image"
                />
              ) : (
                <span className="icon-emoji">
                  {icons[alternative.icon_search] || getEmojiIcon(alternative.icon_search)}
                </span>
              )}
            </div>
            <div className="answer-text">{alternative.text}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Quiz