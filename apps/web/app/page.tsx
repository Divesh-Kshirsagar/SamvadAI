"use client"

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { MetricCards } from '@/components/dashboard/metric-cards'
import { CommandCenter } from '@/components/dashboard/command-center'
import { mockMetrics, mockComplaints } from '@/lib/mock-data'

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('dashboard')

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeItem={activeNav} onItemClick={setActiveNav} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor and manage customer complaints with AI assistance
                </p>
              </div>
            </div>

            {/* Metric Cards */}
            <MetricCards metrics={mockMetrics} />

            {/* Command Center */}
            <CommandCenter complaints={mockComplaints} />
          </div>
        </main>
      </div>
    </div>
  )
}
