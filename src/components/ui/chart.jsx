"use client"

import React from "react"
import { ResponsiveContainer, Tooltip } from "recharts"

export function ChartContainer({ config, children, className }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <style dangerouslySetInnerHTML={{
        __html: Object.entries(config)
          .map(([key, value]) => `:root { --color-${key}: ${value.color}; }`)
          .join("\n")
      }} />
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export function ChartTooltip({ content, cursor }) {
  return <Tooltip cursor={cursor} content={content} />
}

export function ChartTooltipContent({ active, payload, indicator }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="bg-zinc-950/90 backdrop-blur-md border border-zinc-800 p-2.5 rounded-xl text-xs font-mono shadow-2xl space-y-1">
      {payload.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {indicator === "line" && (
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.stroke || item.fill }} />
          )}
          <span className="text-zinc-400 capitalize">{item.name || item.dataKey}:</span>
          <span className="text-white font-bold">{item.value} Units</span>
        </div>
      ))}
    </div>
  )
}