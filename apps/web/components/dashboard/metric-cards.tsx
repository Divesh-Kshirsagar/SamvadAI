"use client"

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, AlertTriangle, Bot, Users, Gauge } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import type { DashboardMetrics } from '@/lib/types'

interface MetricCardsProps {
  metrics: DashboardMetrics
}

interface MetricCardProps {
  title: string
  value: string | number
  suffix?: string
  trend: number[]
  trendDirection: 'up' | 'down'
  trendColor: 'green' | 'red' | 'blue'
  icon: React.ReactNode
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((value, index) => ({ index, value }))
  
  const gradientId = `gradient-${color}-${Math.random().toString(36).substr(2, 9)}`
  const strokeColor = color === 'green' ? '#22c55e' : color === 'red' ? '#ef4444' : '#6366f1'
  const fillColor = color === 'green' ? '#22c55e' : color === 'red' ? '#ef4444' : '#6366f1'

  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function MetricCard({ title, value, suffix, trend, trendDirection, trendColor, icon }: MetricCardProps) {
  const lastValue = trend[trend.length - 1]
  const prevValue = trend[trend.length - 2]
  const changePercent = prevValue ? (((lastValue - prevValue) / prevValue) * 100).toFixed(1) : '0'
  
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-muted-foreground">{icon}</span>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-bold text-foreground">{value}</h3>
              {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {trendDirection === 'up' ? (
                <TrendingUp className={`w-3 h-3 ${trendColor === 'green' ? 'text-emerald-500' : 'text-red-500'}`} />
              ) : (
                <TrendingDown className={`w-3 h-3 ${trendColor === 'green' ? 'text-emerald-500' : 'text-red-500'}`} />
              )}
              <span className={`text-xs font-medium ${trendColor === 'green' ? 'text-emerald-500' : trendColor === 'red' ? 'text-red-500' : 'text-primary'}`}>
                {changePercent}%
              </span>
              <span className="text-xs text-muted-foreground">vs last week</span>
            </div>
          </div>
          <div className="w-20 h-10">
            <Sparkline data={trend} color={trendColor} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Active Complaints"
        value={metrics.totalActiveComplaints.toLocaleString()}
        trend={metrics.totalActiveComplaintsTrend}
        trendDirection="up"
        trendColor="blue"
        icon={<Users className="w-4 h-4" />}
      />
      <MetricCard
        title="Average Sentiment"
        value={metrics.averageSentiment}
        suffix="%"
        trend={metrics.averageSentimentTrend}
        trendDirection="up"
        trendColor="green"
        icon={<Gauge className="w-4 h-4" />}
      />
      <MetricCard
        title="SLA Breaches"
        value={metrics.slaBreaches}
        trend={metrics.slaBreachesTrend}
        trendDirection="down"
        trendColor="green"
        icon={<AlertTriangle className="w-4 h-4" />}
      />
      <MetricCard
        title="AI Resolution Rate"
        value={metrics.aiResolutionRate}
        suffix="%"
        trend={metrics.aiResolutionRateTrend}
        trendDirection="up"
        trendColor="green"
        icon={<Bot className="w-4 h-4" />}
      />
    </div>
  )
}
