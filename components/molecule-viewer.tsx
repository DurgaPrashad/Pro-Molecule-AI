"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Rotate3D, ZoomIn, ZoomOut } from "lucide-react"

export function MoleculeViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [selectedMolecule, setSelectedMolecule] = useState("aspirin")

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Simple molecule rendering (in a real app, this would use a 3D library)
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.scale(zoom, zoom)
    ctx.rotate(rotation.x)

    // Draw a simple molecule representation
    if (selectedMolecule === "aspirin") {
      drawAspirin(ctx)
    } else if (selectedMolecule === "paracetamol") {
      drawParacetamol(ctx)
    } else {
      drawDefaultMolecule(ctx)
    }

    ctx.restore()
  }, [rotation, zoom, selectedMolecule])

  const drawAspirin = (ctx: CanvasRenderingContext2D) => {
    // Benzene ring
    ctx.beginPath()
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    const radius = 50
    ctx.ellipse(0, 0, radius, radius * 0.7, 0, 0, Math.PI * 2)
    ctx.stroke()

    // Functional groups
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.lineTo(radius + 30, 0)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(radius + 40, 0, 10, 0, Math.PI * 2)
    ctx.fillStyle = "red"
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(0, -radius)
    ctx.lineTo(0, -radius - 30)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(0, -radius - 40, 10, 0, Math.PI * 2)
    ctx.fillStyle = "blue"
    ctx.fill()
  }

  const drawParacetamol = (ctx: CanvasRenderingContext2D) => {
    // Benzene ring
    ctx.beginPath()
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    const radius = 50
    ctx.ellipse(0, 0, radius, radius * 0.7, 0, 0, Math.PI * 2)
    ctx.stroke()

    // Functional groups
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.lineTo(radius + 40, 0)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(radius + 50, 0, 10, 0, Math.PI * 2)
    ctx.fillStyle = "green"
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(-radius, 0)
    ctx.lineTo(-radius - 40, 0)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(-radius - 50, 0, 10, 0, Math.PI * 2)
    ctx.fillStyle = "orange"
    ctx.fill()
  }

  const drawDefaultMolecule = (ctx: CanvasRenderingContext2D) => {
    // Simple atom representation
    ctx.beginPath()
    ctx.arc(0, 0, 30, 0, Math.PI * 2)
    ctx.fillStyle = "#6366f1"
    ctx.fill()

    // Bonds
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(Math.cos(angle) * 70, Math.sin(angle) * 70)
      ctx.strokeStyle = "#333"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(Math.cos(angle) * 80, Math.sin(angle) * 80, 10, 0, Math.PI * 2)
      ctx.fillStyle = i % 2 === 0 ? "#ef4444" : "#22c55e"
      ctx.fill()
    }
  }

  const handleRotate = () => {
    setRotation((prev) => ({ x: prev.x + 0.1, y: prev.y + 0.1 }))
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between mb-2">
        <Select value={selectedMolecule} onValueChange={setSelectedMolecule}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select molecule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aspirin">Aspirin</SelectItem>
            <SelectItem value="paracetamol">Paracetamol</SelectItem>
            <SelectItem value="custom">Custom Molecule</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={handleRotate}>
            <Rotate3D className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-muted/30 rounded-md overflow-hidden">
        <canvas ref={canvasRef} width={300} height={250} className="w-full h-full" />
      </div>
    </div>
  )
}

