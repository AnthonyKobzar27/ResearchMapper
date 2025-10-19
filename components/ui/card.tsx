import React from 'react'

export const Card = ({ children, className }: any) => <div className={`rounded-lg border bg-white p-4 ${className || ''}`}>{children}</div>
export const CardHeader = ({ children }: any) => <div className="mb-2">{children}</div>
export const CardTitle = ({ children }: any) => <h3 className="font-semibold">{children}</h3>
export const CardDescription = ({ children }: any) => <p className="text-sm text-gray-600">{children}</p>
export const CardContent = ({ children }: any) => <div>{children}</div>
export const CardFooter = ({ children }: any) => <div className="mt-4">{children}</div>

