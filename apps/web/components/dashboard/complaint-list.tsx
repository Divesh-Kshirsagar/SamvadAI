"use client"

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Mail, Phone, MessageCircle, Angry, Frown, Meh, HelpCircle, Smile } from 'lucide-react'
import type { Complaint, Channel, Priority, Sentiment } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

interface ComplaintListProps {
  complaints: Complaint[]
  selectedId: string | null
  onSelect: (complaint: Complaint) => void
}

const channelIcons: Record<Channel, React.ReactNode> = {
  whatsapp: <MessageCircle className="w-4 h-4 text-emerald-500" />,
  email: <Mail className="w-4 h-4 text-blue-500" />,
  phone: <Phone className="w-4 h-4 text-amber-500" />,
  chat: <MessageSquare className="w-4 h-4 text-purple-500" />,
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  urgent: { label: 'Urgent', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  high: { label: 'High', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  medium: { label: 'Medium', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  low: { label: 'Low', className: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
}

const sentimentIcons: Record<Sentiment, React.ReactNode> = {
  angry: <Angry className="w-4 h-4 text-red-500" />,
  frustrated: <Frown className="w-4 h-4 text-orange-500" />,
  confused: <HelpCircle className="w-4 h-4 text-amber-500" />,
  neutral: <Meh className="w-4 h-4 text-slate-400" />,
  satisfied: <Smile className="w-4 h-4 text-emerald-500" />,
}

export function ComplaintList({ complaints, selectedId, onSelect }: ComplaintListProps) {
  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Recent Complaints</h2>
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
          {complaints.length}
        </Badge>
      </div>
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {complaints.map((complaint) => (
            <button
              key={complaint.id}
              onClick={() => onSelect(complaint)}
              className={cn(
                "w-full p-4 text-left transition-colors hover:bg-secondary/50",
                selectedId === complaint.id && "bg-secondary"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Channel Icon */}
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary shrink-0">
                  {channelIcons[complaint.channel]}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground truncate">
                      {complaint.customerName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {complaint.subject}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", priorityConfig[complaint.priority].className)}
                    >
                      {priorityConfig[complaint.priority].label}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {sentimentIcons[complaint.sentiment]}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
