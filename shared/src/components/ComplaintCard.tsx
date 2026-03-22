import React from 'react';
import { ComplaintDetail } from '../types/complaint';
import { PriorityBadge } from './PriorityBadge';
import { StatusChip } from './StatusChip';
import { SLATimer } from './SLATimer';

export interface ComplaintCardProps {
  complaint: ComplaintDetail;
  onPress?: () => void;
}

export function ComplaintCard({ complaint, onPress }: ComplaintCardProps) {
  return React.createElement(
    'div',
    {
      onClick: onPress,
      style: {
        padding: '16px',
        border: '1px solid #e4e4e7',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        cursor: onPress ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }
    },
    // Header row
    React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
      React.createElement('strong', { style: { fontSize: '16px' } }, complaint.customer_name),
      React.createElement(PriorityBadge, { priority: complaint.actual_priority })
    ),
    // Details
    React.createElement(
      'div',
      { style: { color: '#71717a', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px' } },
      React.createElement('span', null, `Channel: ${complaint.channel}`),
      React.createElement('span', null, `Account: ${complaint.account_type}`)
    ),
    // Footer row
    React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' } },
      React.createElement(StatusChip, { status: complaint.status }),
      complaint.analysis?.sla_hours 
        ? React.createElement(SLATimer, { timestamp: complaint.timestamp, slaHours: complaint.analysis.sla_hours })
        : null
    )
  );
}
