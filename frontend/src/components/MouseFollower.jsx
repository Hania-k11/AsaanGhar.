import React, { useState, useEffect } from 'react'

const MouseFollower = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(true)
  const [isLargeScreen, setIsLargeScreen] = useState(true)

  useEffect(() => {
    // Check screen size on mount and resize
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024) // Use 768px as breakpoint (md)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  useEffect(() => {
    if (!isLargeScreen) return

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isLargeScreen])

  if (!isLargeScreen || !isVisible) return null

  return (
    <div
      className="fixed w-7 h-7 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full pointer-events-none z-50 opacity-20 blur-sm transition-opacity duration-300"
      style={{
        left: mousePosition.x - 12,
        top: mousePosition.y - 12,
        transform: 'translate3d(0, 0, 0)'
      }}
    ></div>
  )
}

export default MouseFollower
