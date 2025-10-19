import React from 'react'

export const Select = ({ children, value, onValueChange }: any) => (
  <div>{React.Children.map(children, child => React.cloneElement(child, { value, onValueChange }))}</div>
)

export const SelectTrigger = ({ children, className }: any) => (
  <div className={`border rounded px-3 py-2 ${className || ''}`}>{children}</div>
)

export const SelectValue = ({ placeholder, value }: any) => <span>{value || placeholder}</span>

export const SelectContent = ({ children, value, onValueChange }: any) => (
  <div className="absolute z-50 bg-white border rounded-lg shadow-lg mt-1">
    {React.Children.map(children, child => React.cloneElement(child, { onValueChange }))}
  </div>
)

export const SelectItem = ({ children, value, onValueChange }: any) => (
  <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => onValueChange?.(value)}>
    {children}
  </div>
)

