import React from 'react';

export interface StatusChipProps {
  status: string;
}

export function StatusChip({ status }: StatusChipProps) {
  const isResolved = status === 'Resolved';
  const isOpen = status === 'Open';

  return React.createElement(
    'div',
    {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: isResolved ? '#166534' : isOpen ? '#1e3a8a' : '#854d0e',
        backgroundColor: isResolved ? '#dcfce7' : isOpen ? '#dbeafe' : '#fef08a',
        border: `1px solid ${isResolved ? '#bbf7d0' : isOpen ? '#bfdbfe' : '#fde047'}`
      }
    },
    status
  );
}
