import React from 'react'

export const Progress = ({ value, className }: any) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className || ''}`}>
    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${value}%` }} />
  </div>
)

