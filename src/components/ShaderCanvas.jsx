import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function ShaderCanvas({ 
  fragmentShader, 
  vertexShader = `
    attribute vec4 position;
    void main() {
      gl_Position = position;
    }
  `,
  width = 400, 
  height = 300,
  uniforms = {}
}) {
  const mountRef = useRef(null)
  const rendererRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (!fragmentShader) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const geometry = new THREE.PlaneGeometry(2, 2)
    
    const shaderUniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2(width, height) },
      ...uniforms
    }

    const material = new THREE.ShaderMaterial({
      uniforms: shaderUniforms,
      vertexShader,
      fragmentShader
    })

    const plane = new THREE.Mesh(geometry, material)
    scene.add(plane)

    const animate = () => {
      shaderUniforms.time.value = performance.now() / 1000
      renderer.render(scene, camera)
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (rendererRef.current) {
        mountRef.current?.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [fragmentShader, vertexShader, width, height])

  return (
    <div className="not-prose my-8">
      <div 
        ref={mountRef} 
        className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mx-auto"
        style={{ width: width, height: height }}
      />
    </div>
  )
} 