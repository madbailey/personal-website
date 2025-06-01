import { useEffect, useRef } from 'react'

export default function ShaderArt() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    let animationId

    // Simple animated gradient effect
    let time = 0
    const animate = () => {
      time += 0.01
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, `hsl(${240 + Math.sin(time) * 30}, 70%, 60%)`)
      gradient.addColorStop(0.5, `hsl(${280 + Math.cos(time * 1.2) * 40}, 80%, 70%)`)
      gradient.addColorStop(1, `hsl(${320 + Math.sin(time * 0.8) * 50}, 75%, 65%)`)
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add floating particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(time + i) * 100) + canvas.width / 2
        const y = (Math.cos(time * 1.5 + i) * 80) + canvas.height / 2
        // Fix: Ensure size is always positive by using Math.abs and adding a minimum
        const size = Math.abs(Math.sin(time + i)) * 3 + 1
        
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
      
      animationId = requestAnimationFrame(animate)
    }

    // Set canvas size with error handling
    const resizeCanvas = () => {
      if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio
        canvas.height = canvas.offsetHeight * window.devicePixelRatio
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
    }

    resizeCanvas()
    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-xl"
      style={{ width: '100%', height: '400px' }}
    />
  )
}