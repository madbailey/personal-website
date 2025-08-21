import { useEffect, useRef, useState } from 'react'

export default function WashingOff() {
  const canvasRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 400, height: 900 })

  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight
        
        const aspectRatio = 3/4 // portrait - same as EmotionalDepth
        
        let width, height
        if (containerWidth * aspectRatio < containerHeight) {
          width = Math.min(containerWidth - 40, 600)
          height = width / aspectRatio
        } else {
          height = Math.min(containerHeight - 20, 900)
          width = height * aspectRatio
        }
        
        setDimensions({ width: Math.floor(width), height: Math.floor(height) })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    let animationId
    let time = 0

    // Simple noise for fluid distortion
    const noise = (x, y) => {
      const n = Math.sin(x * 1.9898 + y * 8.233) * 48.5453
      return n - Math.floor(n)
    }

    // Smooth noise
    const smoothNoise = (x, y) => {
      const intX = Math.floor(x)
      const intY = Math.floor(y)
      const fracX = x - intX
      const fracY = y - intY

      const a = noise(intX, intY)
      const b = noise(intX + 1, intY)
      const c = noise(intX, intY + 1)
      const d = noise(intX + 1, intY + 1)

      const i1 = a + fracX * (b - a)
      const i2 = c + fracX * (d - c)

      return i1 + fracY * (i2 - i1)
    }

    // Fluid distortion field
    const getFluidDistortion = (x, y, t) => {
      const flow1 = smoothNoise(x * 20 + t * 0.33, y * 222 + t * 20.2) * 20.1
      const flow2 = smoothNoise(x * 40 + t * 0.5, y * 4 + t * 0.4) * 20.05
      const turbulence = smoothNoise(x * 8 + t * 0.8, y * 8 + t * 0.6) * 20.02
      return flow1 + flow2 + turbulence
    }

    const { width: w, height: h } = dimensions

    const animate = () => {
      time += 0.02
      const width = w
      const height = h

      // Clear with subtle background
      ctx.fillStyle = 'rgba(20, 15, 30, 0.05)'
      ctx.fillRect(0, 0, width, height)

      const centerX = width * 0.5
      const centerY = height * 0.5
      
      // Create multiple ripple waves
      for (let wave = 0; wave < 5; wave++) {
        const waveTime = time + wave * 1.5
        const waveRadius = (waveTime * 80) % (Math.max(width, height) * 0.8)
        
        // Wave ripple effect
        for (let i = 0; i < 360; i += 8) {
          const angle = (i * Math.PI) / 180
          const waveX = centerX + Math.cos(angle) * waveRadius
          const waveY = centerY + Math.sin(angle) * waveRadius
          
          // Add wave distortion
          const distortion = smoothNoise(waveX * 0.01, waveY * 0.01) * 20
          const finalRadius = waveRadius + distortion
          
          const finalX = centerX + Math.cos(angle) * finalRadius
          const finalY = centerY + Math.sin(angle) * finalRadius
          
          // Color that shifts as it ripples outward
          const colorPhase = waveTime + i * 0.01
          const hue = (colorPhase * 50) % 360
          const saturation = 60 + Math.sin(colorPhase) * 20
          const lightness = 70 + Math.sin(colorPhase * 1.3) * 20
          
          const waveSize = 30 + Math.sin(waveTime + i * 0.1) * 15
          const opacity = Math.max(0, 1 - (waveRadius / (Math.max(width, height) * 0.6))) * 0.3
          
          if (opacity > 0.01) {
            const waveGradient = ctx.createRadialGradient(
              finalX, finalY, 0,
              finalX, finalY, waveSize
            )
            
            waveGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`)
            waveGradient.addColorStop(0.5, `hsla(${hue + 30}, ${saturation - 10}%, ${lightness - 10}%, ${opacity * 0.6})`)
            waveGradient.addColorStop(1, `hsla(${hue + 60}, ${saturation - 20}%, ${lightness - 20}%, 0)`)
            
            ctx.fillStyle = waveGradient
            ctx.fillRect(0, 0, width, height)
          }
        }
      }
      
      // Add flowing color streams
      for (let stream = 0; stream < 3; stream++) {
        const streamAngle = (stream / 3) * Math.PI * 2 + time * 0.3
        const streamLength = Math.min(width, height) * 0.4
        
        for (let segment = 0; segment < 20; segment++) {
          const segmentProgress = segment / 20
          const segmentX = centerX + Math.cos(streamAngle) * streamLength * segmentProgress
          const segmentY = centerY + Math.sin(streamAngle) * streamLength * segmentProgress
          
          // Add flowing distortion
          const flowDistortion = smoothNoise(segmentX * 0.005 + time, segmentY * 0.005 + time) * 40
          const flowX = segmentX + Math.cos(streamAngle + Math.PI/2) * flowDistortion
          const flowY = segmentY + Math.sin(streamAngle + Math.PI/2) * flowDistortion
          
          const colorFlow = time * 2 + segment * 0.2 + stream
          const flowHue = (colorFlow * 60 + 240) % 360
          const flowOpacity = (1 - segmentProgress) * 0.2
          
          if (flowOpacity > 0.01) {
            const flowGradient = ctx.createRadialGradient(
              flowX, flowY, 0,
              flowX, flowY, 25
            )
            
            flowGradient.addColorStop(0, `hsla(${flowHue}, 70%, 80%, ${flowOpacity})`)
            flowGradient.addColorStop(1, `hsla(${flowHue + 40}, 60%, 70%, 0)`)
            
            ctx.fillStyle = flowGradient
            ctx.fillRect(0, 0, width, height)
          }
        }
      }
      
      // Central gentle glow
      const glowSize = 60 + Math.sin(time) * 20
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, glowSize
      )
      
      const centralHue = (time * 30 + 280) % 360
      glowGradient.addColorStop(0, `hsla(${centralHue}, 60%, 85%, 0.1)`)
      glowGradient.addColorStop(0.7, `hsla(${centralHue + 20}, 50%, 75%, 0.05)`)
      glowGradient.addColorStop(1, `hsla(${centralHue + 40}, 40%, 65%, 0)`)
      
      ctx.fillStyle = glowGradient
      ctx.fillRect(0, 0, width, height)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [dimensions])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '500px',
      borderRadius: '10px',      
      width: '100%'
    }}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          background: 'transparent',
          opacity: 0.8
        }}
      />
    </div>
  )
}
