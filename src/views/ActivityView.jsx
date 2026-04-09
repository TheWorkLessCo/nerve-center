import { useState, useEffect } from 'react'
import ActivityRow from '../components/ActivityRow'
import MetricCard from '../components/MetricCard'
import { Activity, AlertCircle, Users, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { SkeletonCard, SkeletonActivityFeed } from '../components/Skeleton'

function ActivityView() {
  const [activities, setActivities] = useState([])
  const [filter, setFilter] = useState('all') // 'all' | 'errors'
  const [loading, setLoading] = useState(true)

  // Fetch last 100 activities on mount
  useEffect(() => {
    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (!error && data) {
        setActivities(data.map(a => ({
          id: a.id,
          agent: a.agent_name || a.agent,
          action: a.action,
          description: a.description || a.metadata?.description,
          status: a.status,
          timestamp: new Date(a.created_at),
        })))
      }
      setLoading(false)
    }
    fetchActivities()
  }, [])

  // Subscribe to new activity via Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel('activity')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_log' },
        (payload) => {
          const newActivity = payload.new
          setActivities(prev => [{
            id: newActivity.id,
            agent: newActivity.agent_name || newActivity.agent,
            action: newActivity.action,
            description: newActivity.description || newActivity.metadata?.description,
            status: newActivity.status,
            timestamp: new Date(newActivity.created_at),
          }, ...prev].slice(0, 100))
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // Calculate metrics from activities array
  const todayActivities = activities.filter(a => {
    const today = new Date()
    const actDate = new Date(a.timestamp)
    return actDate.toDateString() === today.toDateString()
  })

  const errorCount = activities.filter(a => a.status === 'error').length
  const warningCount = activities.filter(a => a.status === 'warning').length
  const agentsOnline = [...new Set(activities.map(a => a.agent).filter(Boolean))].length

  const filteredActivities = filter === 'errors'
    ? activities.filter(a => a.status === 'error' || a.status === 'warning')
    : activities

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header + Metrics */}
      <div className="flex-shrink-0 border-b border-white/10 bg-zinc-900">
        {/* Page title */}
        <div className="px-6 pt-4 pb-0">
          <h2 className="text-[15px] font-semibold text-white">
            Activity Feed
          </h2>
        </div>

        {/* Metric cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-6 py-4">
          <MetricCard
            title="Today"
            value={todayActivities.length}
            change={errorCount === 0 ? (warningCount > 0 ? `${warningCount} warnings` : 'all clear') : `${todayActivities.filter(a => a.status === 'success').length} successful`}
            trend="up"
            icon={Activity}
            accentColor="#5DCAA5"
          />
          <MetricCard
            title="Errors"
            value={errorCount}
            change={`${warningCount} warnings`}
            trend={errorCount > 0 ? 'down' : 'up'}
            icon={AlertCircle}
            accentColor={errorCount > 0 ? '#E24B4A' : '#5DCAA5'}
          />
          <MetricCard
            title="Agents Online"
            value={agentsOnline}
            change="active now"
            trend="neutral"
            icon={Users}
            accentColor="#888888"
          />
        </div>

        {/* Filter bar */}
        <div className="px-6 pb-3 flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#5DCAA5] text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            <CheckCircle2 size={12} />
            All
          </button>
          <button
            onClick={() => setFilter('errors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'errors'
                ? 'bg-red-500 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            <AlertTriangle size={12} />
            Errors
          </button>
        </div>
      </div>

      {/* Activity list */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-2">
          {loading ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
              <SkeletonActivityFeed count={10} />
            </>
          ) : filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
              <Info size={32} className="mb-3 opacity-40" />
              <p className="text-sm">No activity to show</p>
            </div>
          ) : (
            filteredActivities.map(activity => (
              <ActivityRow key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityView
