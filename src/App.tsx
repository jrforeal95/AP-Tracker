import { useState, useCallback } from 'react'
import { useAngpaoStore } from './hooks/useAngpaoStore'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import AddHub from './components/AddHub'
import LineChartScreen from './components/LineChart'
import Rankings from './components/Rankings'
import MorePage from './components/MorePage'
import type { TabId } from './types'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const store = useAngpaoStore()

  const handleNavigate = useCallback((tab: TabId) => {
    setActiveTab(tab)
  }, [])

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && (
        <Dashboard
          entries={store.entries}
          totalAmount={store.totalAmount}
          todayEntries={store.todayEntries}
          dailyAverage={store.dailyAverage}
          projection={store.projection}
          onNavigate={handleNavigate}
          onDelete={store.deleteEntry}
        />
      )}

      {activeTab === 'add' && (
        <AddHub
          recentContacts={store.recentContacts}
          queuedItems={store.queuedItems}
          onSave={store.addEntry}
          onAddToQueue={store.addToQueue}
          onRemoveFromQueue={store.removeFromQueue}
          onNavigate={handleNavigate}
        />
      )}

      {activeTab === 'chart' && (
        <LineChartScreen
          dailyTotals={store.dailyTotals}
          projection={store.projection}
          dailyAverage={store.dailyAverage}
          totalAmount={store.totalAmount}
        />
      )}

      {activeTab === 'rankings' && (
        <Rankings
          rankings={store.rankings}
          categoryBreakdown={store.categoryBreakdown}
          biggestAngpao={store.biggestAngpao}
        />
      )}

      {activeTab === 'more' && (
        <MorePage
          entries={store.entries}
          onImport={store.importEntries}
          totalAmount={store.totalAmount}
          rankings={store.rankings}
          categoryBreakdown={store.categoryBreakdown}
          biggestAngpao={store.biggestAngpao}
          dailyAverage={store.dailyAverage}
          projection={store.projection}
        />
      )}
    </Layout>
  )
}
