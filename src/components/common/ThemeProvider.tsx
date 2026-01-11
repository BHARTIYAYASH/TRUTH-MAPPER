"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { CursorGlow } from "./CursorGlow"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider themes={['light', 'dark', 'system', 'real-dark']} {...props}>
      {children}
      <CursorGlow />
    </NextThemesProvider>
  )
}
