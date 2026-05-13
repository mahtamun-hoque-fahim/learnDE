'use client'
import { useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyGeo = any

export default function Globe({ size = 1400 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    let rotation = 0
    let destroyed = false

    Promise.all([
      import('d3-geo'),
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json()),
      import('topojson-client'),
    ]).then(([d3geo, world, topo]) => {
      if (destroyed) return

      const countries: AnyGeo = topo.feature(world, world.objects.countries)
      const borders: AnyGeo = topo.mesh(world, world.objects.countries, (a: AnyGeo, b: AnyGeo) => a !== b)
      const land: AnyGeo = topo.feature(world, world.objects.land)

      const projection = d3geo.geoOrthographic()
        .scale(size * 0.43)
        .translate([size / 2, size / 2])
        .clipAngle(90)

      const path = d3geo.geoPath(projection, ctx)
      const graticule = d3geo.geoGraticule()()

      function draw() {
        if (destroyed) return
        ctx!.clearRect(0, 0, size, size)

        rotation += 0.07
        projection.rotate([rotation, -20, 0])

        const sphere: AnyGeo = { type: 'Sphere' }

        // Sphere base (dark fill)
        ctx!.beginPath()
        path(sphere)
        ctx!.fillStyle = 'rgba(6, 10, 8, 0.55)'
        ctx!.fill()

        // Graticule lines
        ctx!.beginPath()
        path(graticule)
        ctx!.strokeStyle = 'rgba(160, 180, 170, 0.09)'
        ctx!.lineWidth = 0.4
        ctx!.stroke()

        // Land fill (subtle)
        ctx!.beginPath()
        path(land)
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.025)'
        ctx!.fill()

        // Country borders
        ctx!.beginPath()
        path(borders)
        ctx!.strokeStyle = 'rgba(210, 230, 218, 0.25)'
        ctx!.lineWidth = 0.65
        ctx!.stroke()

        // Outer sphere border
        ctx!.beginPath()
        path(sphere)
        ctx!.strokeStyle = 'rgba(160, 180, 170, 0.10)'
        ctx!.lineWidth = 0.5
        ctx!.stroke()

        animRef.current = requestAnimationFrame(draw)
      }

      draw()
    }).catch(console.error)

    return () => {
      destroyed = true
      cancelAnimationFrame(animRef.current)
    }
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        left: '50%',
        bottom: -340,
        transform: 'translateX(-50%)',
        width: size,
        height: size,
        pointerEvents: 'none',
        opacity: 0.62,
        zIndex: 0,
      }}
    />
  )
}
