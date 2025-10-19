import React from 'react'

export const Badge = ({ children, variant, className }: any) => (
  <span className={`inline-block px-2 py-1 text-xs rounded ${className || ''}`}>{children}</span>
)

