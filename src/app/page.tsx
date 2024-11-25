import TaskManager from '../components/TaskManager'
import WeatherWidget from '../components/WeatherWidget'
import NewsFeed from '../components/NewsFeed'
import CanvasAssignments from '../components/CanvasAssignments'

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <TaskManager />
        <CanvasAssignments />
      </div>
      <div className="space-y-6">
        <WeatherWidget />
        <NewsFeed />
      </div>
    </div>
  )
}





