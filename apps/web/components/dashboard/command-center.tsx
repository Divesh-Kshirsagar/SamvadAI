"use client"

import { useState } from 'react'
import { ComplaintList } from './complaint-list'
import { AIInsightPanel } from './ai-insight-panel'
import type { Complaint } from '@/lib/types'

interface CommandCenterProps {
  complaints: Complaint[]
}

export function CommandCenter({ complaints }: CommandCenterProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    complaints[0] || null
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-16rem)]">
      {/* Complaint List - 40% */}
      <div className="lg:col-span-5 h-full">
        <ComplaintList
          complaints={complaints}
          selectedId={selectedComplaint?.id ?? null}
          onSelect={setSelectedComplaint}
        />
      </div>
      
      {/* AI Insight Panel - 60% */}
      <div className="lg:col-span-7 h-full">
        <AIInsightPanel complaint={selectedComplaint} />
      </div>
    </div>
  )
}
