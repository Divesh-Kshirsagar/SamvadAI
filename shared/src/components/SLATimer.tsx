import React from 'react';
import { calculateSLARemaining, formatSLA } from '../utils/sla';

export interface SLATimerProps {
  timestamp: string;
  slaHours: number;
}

export function SLATimer({ timestamp, slaHours }: SLATimerProps) {
  const { remainingHours, isBreached } = calculateSLARemaining(timestamp, slaHours);
  const text = formatSLA(remainingHours);

  return React.createElement(
    'span',
    {
      style: {
        fontSize: '14px',
        fontWeight: isBreached ? 700 : 500,
        color: isBreached ? '#ef4444' : '#10b981',
      }
    },
    text
  );
}
