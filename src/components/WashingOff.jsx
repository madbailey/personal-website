import { useEffect, useRef } from 'react'

export default function WashingOff() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId

    // Steam/wash effect variables
    let time = 0
    const droplets = []
    const steamParticles = []

    // Initialize droplets
    for (let i = 0; i < 50; i++) {
      droplets.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.2
      })
    }

    // Initialize steam particles
    for (let i = 0; i < 30; i++) {
      steamParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.8 - 0.2,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 50
      })
    }

    const animate = () => {
      time += 0.02

      // Clear with slight fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw water-like base gradient
      const baseGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      baseGradient.addColorStop(0, `rgba(100, 150, 255, 0.3)`)
      baseGradient.addColorStop(0.5, `rgba(150, 200, 255, 0.4)`)
      baseGradient.addColorStop(1, `rgba(200, 230, 255, 0.3)`)

      ctx.fillStyle = baseGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw steam particles
      steamParticles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life += 1

        if (particle.life > particle.maxLife) {
          particle.life = 0
          particle.x = Math.random() * canvas.width
          particle.y = canvas.height + 10
        }

        const opacity = 1 - (particle.life / particle.maxLife)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw water droplets with scrubbing effect
      droplets.forEach((droplet, index) => {
        // Move droplets downward
        droplet.y += droplet.speed

        // Reset if off screen
        if (droplet.y > canvas.height) {
          droplet.y = -10
          droplet.x = Math.random() * canvas.width
        }

        // Add some horizontal movement
        droplet.x += Math.sin(time + index) * 0.5

        // Draw droplet with heat distortion effect
        const heatDistortion = Math.sin(time * 3 + index) * 2
        ctx.fillStyle = `rgba(200, 220, 255, ${droplet.opacity})`

        ctx.beginPath()
        ctx.arc(droplet.x + heatDistortion, droplet.y, droplet.size, 0, Math.PI * 2)
        ctx.fill()

        // Add trail effect
        ctx.strokeStyle = `rgba(255, 255, 255, ${droplet.opacity * 0.3})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(droplet.x + heatDistortion, droplet.y)
        ctx.lineTo(droplet.x + heatDistortion, droplet.y - droplet.size * 3)
        ctx.stroke()
      })

      // Add heat shimmer effect
      for (let i = 0; i < 20; i++) {
        const x = (canvas.width / 20) * i + Math.sin(time * 2 + i) * 10
        const y = canvas.height * 0.3 + Math.cos(time + i) * 20

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.sin(time * 3 + i) * 0.2 + 0.1})`
        ctx.beginPath()
        ctx.arc(x, y, 1, 0, Math.PI * 2)
        ctx.fill()
      }

      // Add scrubbing lines effect
      ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        const y = (canvas.height / 5) * i + Math.sin(time * 4 + i) * 5
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y + Math.sin(time * 2 + i * 10) * 3)
        ctx.stroke()
      }

      animationId = requestAnimationFrame(animate)
    }

    // Set canvas size with error handling
    const resizeCanvas = () => {
      if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio
        canvas.height = canvas.offsetHeight * window.devicePixelRatio
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

        // Recreate particles with new dimensions
        droplets.length = 0
        steamParticles.length = 0

        for (let i = 0; i < 50; i++) {
          droplets.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 2 + 1,
            opacity: Math.random() * 0.6 + 0.2
          })
        }

        for (let i = 0; i < 30; i++) {
          steamParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -Math.random() * 0.8 - 0.2,
            life: Math.random() * 100,
            maxLife: 100 + Math.random() * 50
          })
        }
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
