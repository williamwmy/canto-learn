import './StartPage.css'
import packageInfo from '../../package.json'

const StartPage = ({ onStartQuiz }) => {
  const handleStart = (questionCount) => {
    onStartQuiz(questionCount)
  }

  return (
    <div className="start-page">
      <div className="start-container">
        <h1>🗣️ Lær kantonesisk</h1>
        <p className="subtitle">Øv på dagligdagse kantonesiske ord og setninger</p>
        
        <div className="question-options">
          <h2>Hvor mange spørsmål vil du ha?</h2>
          
          <div className="option-buttons">
            <button 
              className="option-btn short"
              onClick={() => handleStart(5)}
            >
              <span className="number">5</span>
              <span className="label">Kort quiz</span>
              <span className="time">~2 min</span>
            </button>
            
            <button 
              className="option-btn medium"
              onClick={() => handleStart(10)}
            >
              <span className="number">10</span>
              <span className="label">Medium quiz</span>
              <span className="time">~4 min</span>
            </button>
            
            <button 
              className="option-btn long"
              onClick={() => handleStart(20)}
            >
              <span className="number">20</span>
              <span className="label">Lang quiz</span>
              <span className="time">~8 min</span>
            </button>
          </div>
        </div>
        
        <div className="features">
          <div className="feature">
            <span className="icon">🔊</span>
            <span>Lyd på kantonesisk</span>
          </div>
          <div className="feature">
            <span className="icon">🎯</span>
            <span>Visuell læring</span>
          </div>
          <div className="feature">
            <span className="icon">📱</span>
            <span>Funker offline</span>
          </div>
        </div>
      </div>
      <div className="version-info">
        v{packageInfo.version}
      </div>
    </div>
  )
}

export default StartPage