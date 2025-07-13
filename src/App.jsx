import { useState } from 'react'
import Quiz from './components/Quiz'
import StartPage from './components/StartPage'
import './App.css'

function App() {
  const [gameState, setGameState] = useState('start') // 'start' or 'quiz'
  const [questionCount, setQuestionCount] = useState(10)

  const handleStartQuiz = (count) => {
    setQuestionCount(count)
    setGameState('quiz')
  }

  const handleRestart = () => {
    setGameState('start')
  }

  return (
    <div className="app">
      {gameState === 'start' ? (
        <StartPage onStartQuiz={handleStartQuiz} />
      ) : (
        <Quiz 
          questionCount={questionCount} 
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}

export default App
