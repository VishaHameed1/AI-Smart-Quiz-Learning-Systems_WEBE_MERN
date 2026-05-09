 import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">📚 LearnSmart</h1>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Master Any Subject with <span className="text-blue-600">AI</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Personalized learning, smart quizzes, and spaced repetition to help you learn faster and remember longer.
        </p>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors"
        >
          Start Learning Free →
        </Link>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Smart Quizzes</h3>
            <p className="text-gray-600">AI-powered quizzes that adapt to your skill level</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">Spaced Repetition</h3>
            <p className="text-gray-600">Science-based review system for better retention</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">Gamification</h3>
            <p className="text-gray-600">Earn XP, badges, and compete on leaderboards</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
