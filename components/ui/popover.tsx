import React, { useState } from 'react'

export const Popover = ({ children, open: controlledOpen, onOpenChange }: any) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  return <div>{React.Children.map(children, child => React.cloneElement(child, { open, setOpen }))}</div>
}

export const PopoverTrigger = ({ children, asChild, open, setOpen }: any) => (
  <div onClick={() => setOpen?.(!open)}>{children}</div>
)

export const PopoverContent = ({ children, className, align, open }: any) => open ? (
  <div className={`absolute z-50 bg-white border rounded-lg shadow-lg p-4 ${className || ''}`}>{children}</div>
) : null

