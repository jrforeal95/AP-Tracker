import { useState, useCallback } from 'react'
import { useAngpaoStore } from './hooks/useAngpaoStore'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import AddHub from './components/AddHub'
import LineChartScreen from './components/LineChart'
import Rankings from './components/Rankings'
import MorePage from './components/MorePage'
import type { AngpaoEntry, TabId } from './types'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [editingEntry, setEditingEntry] = useState<AngpaoEntry | null>(null)
  const store = useAngpaoStore()

  const handleNavigate = useCallback((tab: TabId) => {
    setActiveTab(tab)
  }, [])

  const handleEditEntry = useCallback((entry: AngpaoEntry) => {
    setEditingEntry(entry)
    setActiveTab('add')
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingEntry(null)
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
          onEdit={handleEditEntry}
        />
      )}

      {activeTab === 'add' && (
        <AddHub
          recentContacts={store.recentContacts}
          queuedItems={store.queuedItems}
          onSave={store.addEntry}
          onUpdate={store.editEntry}
          editingEntry={editingEntry}
          onCancelEdit={handleCancelEdit}
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
