"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [currentPath, setCurrentPath] = useState(pathname)

  useEffect(() => {
    // Only update when pathname actually changes (route navigation)
    if (pathname !== currentPath) {
      setCurrentPath(pathname)
    }
  }, [pathname, currentPath])

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={currentPath} // Only re-animate on actual route changes
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
