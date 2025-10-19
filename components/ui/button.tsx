import React from 'react'

export const Button = ({ children, onClick, className, variant, size, ...props }: any) => (
  <button onClick={onClick} className={`px-4 py-2 rounded ${className || ''}`} {...props}>
    {children}
  </button>
)

