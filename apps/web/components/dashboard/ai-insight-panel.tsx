"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sparkles,
  Send,
  Pencil,
  RotateCcw,
  AlertTriangle,
  Lock,
  ArrowUpRight,
  Zap,
  DollarSign,
  Phone,
  Key,
  Link,
  PhoneCall,
  CreditCard,
  Gift,
  Flag,
  CheckCircle,
  FileCheck,
  FileText,
  Calendar,
  Copy,
  Check,
} from 'lucide-react'
import type { Complaint, SuggestedAction } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AIInsightPanelProps {
  complaint: Complaint | null
}

const actionIcons: Record<string, React.ReactNode> = {
  RotateCcw: <RotateCcw className="w-4 h-4" />,
  AlertTriangle: <AlertTriangle className="w-4 h-4" />,
  Lock: <Lock className="w-4 h-4" />,
  ArrowUpRight: <ArrowUpRight className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  DollarSign: <DollarSign className="w-4 h-4" />,
  Phone: <Phone className="w-4 h-4" />,
  Key: <Key className="w-4 h-4" />,
  Link: <Link className="w-4 h-4" />,
  PhoneCall: <PhoneCall className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  Gift: <Gift className="w-4 h-4" />,
  Flag: <Flag className="w-4 h-4" />,
  CheckCircle: <CheckCircle className="w-4 h-4" />,
  FileCheck: <FileCheck className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-4">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Select a Complaint</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Choose a complaint from the list to view AI-generated insights, suggested responses, and recommended actions.
      </p>
    </div>
  )
}

function ActionButton({ action, onClick }: { action: SuggestedAction; onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant={action.type === 'primary' ? 'default' : action.type === 'warning' ? 'destructive' : 'outline'}
      size="sm"
      className={cn(
        "justify-start gap-2",
        action.type === 'secondary' && "border-border text-foreground hover:bg-secondary"
      )}
    >
      {actionIcons[action.icon]}
      {action.label}
    </Button>
  )
}

export function AIInsightPanel({ complaint }: AIInsightPanelProps) {
  const [response, setResponse] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!complaint) {
    return (
      <Card className="h-full bg-card border-border">
        <EmptyState />
      </Card>
    )
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(response || complaint.suggestedResponse)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="h-full bg-card border-border flex flex-col overflow-hidden">
      <CardHeader className="border-b border-border pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold text-foreground">AI Insight Panel</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            {complaint.id}
          </Badge>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1">
        <CardContent className="p-4 space-y-6">
          {/* AI Summary */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              AI Summary
            </h4>
            <ul className="space-y-2">
              {complaint.aiSummary.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Sentiment Analysis */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Sentiment Analysis
            </h4>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Frustration Level</span>
                  <span className={cn(
                    "font-medium",
                    complaint.frustrationLevel > 70 ? "text-red-500" :
                    complaint.frustrationLevel > 40 ? "text-amber-500" : "text-emerald-500"
                  )}>
                    {complaint.frustrationLevel}%
                  </span>
                </div>
                <Progress 
                  value={complaint.frustrationLevel} 
                  className="h-2 bg-secondary"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Confidence Score</span>
                  <span className="font-medium text-primary">{complaint.confidenceScore}%</span>
                </div>
                <Progress 
                  value={complaint.confidenceScore} 
                  className="h-2 bg-secondary"
                />
              </div>
            </div>
          </div>

          {/* Gen-AI Draft Response */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Gen-AI Draft Response
              </h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopy}
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
            <div className="relative">
              <Textarea
                value={response || complaint.suggestedResponse}
                onChange={(e) => setResponse(e.target.value)}
                readOnly={!isEditing}
                className={cn(
                  "min-h-[200px] bg-secondary border-border text-sm text-foreground resize-none",
                  !isEditing && "cursor-default"
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="w-4 h-4" />
                Approve & Send
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(!isEditing)}
                className="gap-2 border-border text-foreground hover:bg-secondary"
              >
                <Pencil className="w-4 h-4" />
                {isEditing ? 'Done Editing' : 'Edit with AI'}
              </Button>
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Suggested Actions
            </h4>
            <div className="flex flex-wrap gap-2">
              {complaint.suggestedActions.map((action) => (
                <ActionButton 
                  key={action.id} 
                  action={action} 
                  onClick={() => console.log('Action:', action.label)} 
                />
              ))}
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  )
}
