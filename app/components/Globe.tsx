'use client'
import { useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Geo = any

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

      const countries: Geo = topo.feature(world, world.objects.countries)
      const borders: Geo  = topo.mesh(world, world.objects.countries, (a: Geo, b: Geo) => a !== b)
      const land: Geo     = topo.feature(world, world.objects.land)
      void countries

      const projection = d3geo.geoOrthographic()
        .scale(size * 0.44)
        .translate([size / 2, size / 2])
        .clipAngle(90)

      const path      = d3geo.geoPath(projection, ctx)
      const graticule = d3geo.geoGraticule()()
      const sphere: Geo = { type: 'Sphere' }

      function draw() {
        if (destroyed) return
        ctx!.clearRect(0, 0, size, size)
        rotation += 0.06
        projection.rotate([rotation, -18, 0])

        // Sphere base
        ctx!.beginPath(); path(sphere)
        ctx!.fillStyle = 'rgba(5, 9, 7, 0.5)'; ctx!.fill()

        // Graticule
        ctx!.beginPath(); path(graticule)
        ctx!.strokeStyle = 'rgba(150,175,160,.08)'; ctx!.lineWidth = 0.35; ctx!.stroke()

        // Land (subtle fill)
        ctx!.beginPath(); path(land)
        ctx!.fillStyle = 'rgba(255,255,255,.03)'; ctx!.fill()

        // Country borders — the key detail
        ctx!.beginPath(); path(borders)
        ctx!.strokeStyle = 'rgba(200,225,212,.28)'; ctx!.lineWidth = 0.7; ctx!.stroke()

        // Outer ring
        ctx!.beginPath(); path(sphere)
        ctx!.strokeStyle = 'rgba(140,165,152,.10)'; ctx!.lineWidth = 0.5; ctx!.stroke()

        animRef.current = requestAnimationFrame(draw)
      }
      draw()
    }).catch(console.error)

    return () => { destroyed = true; cancelAnimationFrame(animRef.current) }
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        left: '50%',
        /* push center of globe (size/2 px from canvas top) to ~hero bottom */
        bottom: -(size * 0.44),
        transform: 'translateX(-50%)',
        width: size,
        height: size,
        pointerEvents: 'none',
        opacity: 0.65,
        zIndex: 0,
      }}
    />
  )
}
