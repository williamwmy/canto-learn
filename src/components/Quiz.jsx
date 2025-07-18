import { useState, useEffect, useCallback } from 'react'
import questionsData from '../data/questions.json'
import { getIconUrl } from '../services/iconService'
import './Quiz.css'

const Quiz = ({ questionCount, onRestart }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [isCorrect, setIsCorrect] = useState(null)
  const [icons, setIcons] = useState({})
  const [shuffledAlternatives, setShuffledAlternatives] = useState([])
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [useApiIcons, setUseApiIcons] = useState(false)
  const [iconsLoading, setIconsLoading] = useState(false)
  const [incorrectAnswers, setIncorrectAnswers] = useState([])
  const [isRetryMode, setIsRetryMode] = useState(false)
  const [starsEarned, setStarsEarned] = useState(0)
  const [showStars, setShowStars] = useState(false)

  const question = quizQuestions[currentQuestion]

  // Calculate stars based on percentage (rounded up)
  const calculateStars = (percentage) => {
    if (percentage === 0) return 0
    return Math.ceil(percentage / 20) // Each star is 20%, rounded up
  }

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
    } else {
      // Track incorrect answer for retry functionality
      setIncorrectAnswers(prev => [...prev, question])
    }
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setIsCorrect(null)
      } else {
        setShowResult(true)
      }
    }, 1500)
  }

  const loadIcons = useCallback(async (alternatives, useApi) => {
    setIconsLoading(true)
    const newIcons = {}
    for (const alternative of alternatives) {
      try {
        newIcons[alternative.icon_search] = await getIconUrl(alternative.icon_search, useApi)
      } catch (error) {
        console.error('Error loading icon:', error)
        newIcons[alternative.icon_search] = getEmojiIcon(alternative.icon_search)
      }
    }
    // Update icons all at once to prevent layout shifts
    setIcons(prevIcons => ({ ...prevIcons, ...newIcons }))
    setIconsLoading(false)
  }, [])

  const handleIconToggle = async () => {
    const newUseApiIcons = !useApiIcons
    setUseApiIcons(newUseApiIcons)
    
    // Reload icons immediately with new setting
    if (question && shuffledAlternatives.length > 0) {
      await loadIcons(shuffledAlternatives, newUseApiIcons)
    }
  }

  const startRetryQuiz = () => {
    // Use only incorrect answers for retry
    setQuizQuestions(incorrectAnswers)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setIsCorrect(null)
    setIncorrectAnswers([])
    setIsRetryMode(true)
    setStarsEarned(0)
    setShowStars(false)
  }

  const resetQuiz = () => {
    // Generate new random questions
    const shuffled = shuffleArray(questionsData)
    const selected = shuffled.slice(0, questionCount)
    setQuizQuestions(selected)
    
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setIsCorrect(null)
    setIncorrectAnswers([])
    setIsRetryMode(false)
    setStarsEarned(0)
    setShowStars(false)
  }

  // Initialize quiz questions on mount
  useEffect(() => {
    const shuffled = shuffleArray(questionsData)
    const selected = shuffled.slice(0, questionCount)
    setQuizQuestions(selected)
  }, [questionCount])

  // Handle question changes (shuffle answers only when question changes)
  useEffect(() => {
    if (!question) return
    
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
  }, [currentQuestion, question])

  // Handle icon loading (load icons when question or icon type changes)
  useEffect(() => {
    if (!question || shuffledAlternatives.length === 0) return
    loadIcons(shuffledAlternatives, useApiIcons)
  }, [question, shuffledAlternatives, loadIcons, useApiIcons])

  const StarRating = ({ stars, total = 5 }) => {
    return (
      <div className="star-rating">
        {[...Array(total)].map((_, index) => (
          <span
            key={index}
            className={`star ${index < stars ? 'filled' : 'empty'}`}
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            ⭐
          </span>
        ))}
      </div>
    )
  }

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
    const percentage = Math.round((score / quizQuestions.length) * 100)
    const stars = calculateStars(percentage)
    let emoji = '🎉'
    let message = 'Gratulerer!'
    
    if (isRetryMode) {
      if (percentage === 100) {
        emoji = '🎯'
        message = 'Perfekt øving!'
      } else if (percentage >= 50) {
        emoji = '📈'
        message = 'Bra forbedring!'
      } else {
        emoji = '🔄'
        message = 'Fortsett å øve!'
      }
    } else {
      if (percentage === 100) {
        emoji = '🌟'
        message = 'Perfekt!'
      } else if (percentage >= 80) {
        emoji = '🎉'
        message = 'Flott jobbet!'
      } else if (percentage >= 60) {
        emoji = '👍'
        message = 'Bra!'
      } else {
        emoji = '💪'
        message = 'Øv mer!'
      }
    }

    // Trigger star animation after a brief delay (but not for retry mode)
    if (!showStars && !isRetryMode) {
      setTimeout(() => {
        setStarsEarned(stars)
        setShowStars(true)
      }, 500)
    }
    
    return (
      <div className="quiz-result">
        <h2>{message} {emoji}</h2>
        <div className="stars-container">
          {showStars && !isRetryMode && <StarRating stars={starsEarned} />}
        </div>
        <p>Du fikk {score} av {quizQuestions.length} riktige!</p>
        <p className="percentage">{percentage}%</p>
        <div className="result-buttons">
          {incorrectAnswers.length > 0 && !isRetryMode && (
            <button onClick={startRetryQuiz} className="retry-btn">
              Øv på feil ({incorrectAnswers.length})
            </button>
          )}
          <button onClick={resetQuiz} className="restart-btn">
            {isRetryMode ? 'Ny øvingsrunde' : 'Prøv igjen'}
          </button>
          <button onClick={onRestart} className="home-btn">
            Tilbake til start
          </button>
        </div>
      </div>
    )
  }

  if (!question) {
    return <div className="loading">Laster spørsmål...</div>
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button 
          onClick={handleIconToggle}
          className="icon-toggle-btn"
          title={useApiIcons ? "Bytt til emoji ikoner" : "Bytt til API ikoner"}
          disabled={iconsLoading}
        >
          {iconsLoading ? "⏳" : (useApiIcons ? "🎨" : "🖼️")}
        </button>
        <h1>Lær kantonesisk</h1>
        <div className="progress">
          {isRetryMode && <span className="retry-mode">🔄 Øvingsrunde </span>}
          Spørsmål {currentQuestion + 1} av {quizQuestions.length}
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
                : selectedAnswer !== null && index === correctAnswerIndex
                  ? 'correct-answer'
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