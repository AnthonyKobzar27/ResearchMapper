import React from 'react'

export const Input = ({ className, type, ...props }: any) => (
  <input 
    type={type || 'text'} 
    className={`border rounded px-3 py-2 ${className || ''}`} 
    {...props} 
  />
)

