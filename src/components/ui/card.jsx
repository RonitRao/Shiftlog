import * as React from "react"

export function Card({ className, ...props }) {
  return <div className={`rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-md ${className}`} {...props} />
}

export function CardHeader({ className, ...props }) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h3 className={`font-semibold leading-none tracking-tight text-zinc-200 ${className}`} {...props} />
}

export function CardDescription({ className, ...props }) {
  return <p className={`text-sm text-zinc-500 ${className}`} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />
}

export function CardFooter({ className, ...props }) {
  return <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />
}