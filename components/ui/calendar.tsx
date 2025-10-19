import React from 'react'

export const Calendar = ({ selected, onSelect, className }: any) => (
  <input 
    type="date" 
    value={selected?.toISOString?.().split('T')[0] || ''} 
    onChange={(e) => onSelect?.(new Date(e.target.value))}
    className={className}
  />
)

