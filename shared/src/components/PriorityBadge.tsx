import React from 'react';

export interface PriorityBadgeProps {
  priority: string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  let color = '#71717a'; // default grey
  let bgColor = '#f4f4f5';

  switch (priority) {
    case 'Urgent':
      color = '#ef4444'; // red
      bgColor = '#fef2f2';
      break;
    case 'High':
      color = '#f97316'; // orange
      bgColor = '#fff7ed';
      break;
    case 'Medium':
      color = '#3b82f6'; // blue
      bgColor = '#eff6ff';
      break;
  }

  return React.createElement(
    'div',
    {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        color: color,
        backgroundColor: bgColor,
      }
    },
    priority
  );
}
