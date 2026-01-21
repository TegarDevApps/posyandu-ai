import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import WelcomeScreen from './components/WelcomeScreen'

function App() {
  const [started, setStarted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleStart = (category = null) => {
    setSelectedCategory(category)
    setStarted(true)
  }

  const handleBackToWelcome = () => {
    setStarted(false)
    setSelectedCategory(null)
  }

  return (
    <div className="min-h-screen w-full">
      {!started ? (
        <WelcomeScreen onStart={handleStart} />
      ) : (
        <ChatInterface 
          initialCategory={selectedCategory} 
          onBackToWelcome={handleBackToWelcome}
        />
      )}
    </div>
  )
}

export default App
