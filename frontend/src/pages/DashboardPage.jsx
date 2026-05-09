 import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function DashboardPage() {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>
          <p>Welcome, {user?.name}!</p>
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold">Total XP</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold">Quizzes Completed</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold">Current Streak</h3>
            <p className="text-3xl font-bold text-orange-600">0 days</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
