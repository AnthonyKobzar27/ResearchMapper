import React from 'react'

export const Drawer = ({ children, open, onOpenChange }: any) => open ? <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50">{children}</div> : null
export const DrawerContent = ({ children }: any) => <div className="h-full overflow-auto p-6">{children}</div>
export const DrawerHeader = ({ children }: any) => <div className="mb-4">{children}</div>
export const DrawerTitle = ({ children }: any) => <h2 className="text-2xl font-bold">{children}</h2>
export const DrawerDescription = ({ children }: any) => <p className="text-gray-600">{children}</p>
export const DrawerClose = ({ children }: any) => <div>{children}</div>

