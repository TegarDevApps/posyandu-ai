import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import WelcomeScreen from './components/WelcomeScreen'

function App() {
  const [started, setStarted] = useState(false)

  return (
    <div className="min-h-screen w-full">
      {!started ? (
        <WelcomeScreen onStart={() => setStarted(true)} />
      ) : (
        <ChatInterface />
      )}
    </div>
  )
}

export default App
