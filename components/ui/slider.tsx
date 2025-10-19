import React from 'react'

export const Slider = ({ value, onValueChange, min, max, step, className }: any) => (
  <input 
    type="range" 
    min={min} 
    max={max} 
    step={step} 
    value={value?.[0] || 0} 
    onChange={(e) => onValueChange?.([parseInt(e.target.value)])}
    className={`w-full ${className || ''}`}
  />
)

