"use client"

import { useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import * as THREE from "three"
import { Eye, EyeOff, ZoomIn, ZoomOut, RotateCw } from "lucide-react"

// Atom colors based on CPK coloring
const ATOM_COLORS = {
  H: 0xffffff, // White
  C: 0x909090, // Grey
  N: 0x3050f8, // Blue
  O: 0xff0d0d, // Red
  F: 0x90e050, // Light Green
  P: 0xff8000, // Orange
  S: 0xffff30, // Yellow
  Cl: 0x1ff01f, // Green
  Br: 0xa62929, // Brown
  I: 0x940094, // Purple
  default: 0xffd3d3, // Default pink
}

// Bond types
const BOND_TYPES = {
  SINGLE: 1,
  DOUBLE: 2,
  TRIPLE: 3,
  AROMATIC: 4,
}

interface Atom {
  element: string
  position: [number, number, number]
  charge?: number
}

interface Bond {
  from: number
  to: number
  type: number
}

interface MoleculeData {
  atoms: Atom[]
  bonds: Bond[]
}

// Parse SMILES to a simplified molecular structure (in a real app, use a proper chemistry library)
const parseMockMolecule = (smiles: string): MoleculeData => {
  // This is a simplified mock parser - in a real app, use RDKit.js or similar
  // For demo purposes, we'll create a mock molecule based on the SMILES length
  const atoms: Atom[] = []
  const bonds: Bond[] = []

  // Create a mock molecule structure based on SMILES
  const elements = ["C", "N", "O", "S", "P", "F", "Cl"]
  const length = Math.min(smiles.length, 20) // Limit to 20 atoms for demo

  // Generate atoms in a spiral pattern
  for (let i = 0; i < length; i++) {
    const angle = (i * 2 * Math.PI) / 10
    const radius = 1.5 + i / 10
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    const z = i * 0.2

    // Use characters from SMILES to determine element (simplified)
    let element = "C" // Default to carbon
    const char = smiles[i].toUpperCase()
    if (["N", "O", "S", "P", "F"].includes(char)) {
      element = char
    } else if (char === "L" && i < smiles.length - 1 && smiles[i + 1].toUpperCase() === "C") {
      element = "Cl"
    }

    atoms.push({
      element,
      position: [x, y, z],
      charge: Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0,
    })

    // Create bonds between consecutive atoms
    if (i > 0) {
      // Determine bond type based on SMILES characters (simplified)
      let bondType = BOND_TYPES.SINGLE
      if (smiles[i] === "=") bondType = BOND_TYPES.DOUBLE
      else if (smiles[i] === "#") bondType = BOND_TYPES.TRIPLE
      else if (smiles[i] === ":") bondType = BOND_TYPES.AROMATIC

      bonds.push({
        from: i - 1,
        to: i,
        type: bondType,
      })
    }

    // Add some cross-links for more complex structures
    if (i > 3 && i % 3 === 0) {
      bonds.push({
        from: i,
        to: i - 3,
        type: BOND_TYPES.SINGLE,
      })
    }
  }

  return { atoms, bonds }
}

// Atom component
const Atom = ({
  position,
  element,
  charge,
  selected,
  onClick,
}: {
  position: [number, number, number]
  element: string
  charge?: number
  selected?: boolean
  onClick?: () => void
}) => {
  const color = ATOM_COLORS[element as keyof typeof ATOM_COLORS] || ATOM_COLORS.default
  const radius = element === "H" ? 0.2 : 0.3

  return (
    <group position={position} onClick={onClick}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={new THREE.Color(color)}
          roughness={0.3}
          metalness={0.2}
          emissive={selected ? new THREE.Color(0xffff00) : undefined}
          emissiveIntensity={selected ? 0.5 : 0}
        />
      </mesh>
      {element && (
        <Html distanceFactor={10}>
          <div className="text-white text-xs font-bold bg-black/50 px-1 rounded-full">
            {element}
            {charge !== undefined && charge !== 0 && <span>{charge > 0 ? "+" : "-"}</span>}
          </div>
        </Html>
      )}
    </group>
  )
}

// Bond component
const Bond = ({
  start,
  end,
  bondType,
}: {
  start: [number, number, number]
  end: [number, number, number]
  bondType: number
}) => {
  // Calculate the midpoint and direction
  const midPoint = new THREE.Vector3((start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2)

  const direction = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2])

  const length = direction.length()
  direction.normalize()

  // Calculate rotation to align with the direction
  const quaternion = new THREE.Quaternion()
  const up = new THREE.Vector3(0, 1, 0)
  quaternion.setFromUnitVectors(up, direction)

  // For double and triple bonds, we need to create offset bonds
  const bonds = []
  const offset = 0.05 // Offset for multiple bonds

  if (bondType === BOND_TYPES.SINGLE || bondType === BOND_TYPES.AROMATIC) {
    bonds.push({ position: [0, 0, 0], dashed: bondType === BOND_TYPES.AROMATIC })
  } else if (bondType === BOND_TYPES.DOUBLE) {
    bonds.push({ position: [offset, 0, 0], dashed: false })
    bonds.push({ position: [-offset, 0, 0], dashed: false })
  } else if (bondType === BOND_TYPES.TRIPLE) {
    bonds.push({ position: [0, 0, 0], dashed: false })
    bonds.push({ position: [offset, 0, 0], dashed: false })
    bonds.push({ position: [-offset, 0, 0], dashed: false })
  }

  return (
    <group position={midPoint} quaternion={quaternion}>
      {bonds.map((bond, index) => (
        <mesh key={index} position={bond.position}>
          <cylinderGeometry args={[0.05, 0.05, length, 8]} />
          <meshStandardMaterial
            color={0x808080}
            roughness={0.4}
            transparent={bond.dashed}
            opacity={bond.dashed ? 0.7 : 1}
            dashSize={bond.dashed ? 0.1 : 0}
            gapSize={bond.dashed ? 0.1 : 0}
          />
        </mesh>
      ))}
    </group>
  )
}

// Molecule component
const Molecule = ({
  data,
  displayMode,
  showCharges,
  showLabels,
}: {
  data: MoleculeData
  displayMode: string
  showCharges: boolean
  showLabels: boolean
}) => {
  const [selectedAtom, setSelectedAtom] = useState<number | null>(null)

  return (
    <group>
      {/* Render bonds first so they appear behind atoms */}
      {data.bonds.map((bond, index) => (
        <Bond
          key={`bond-${index}`}
          start={data.atoms[bond.from].position}
          end={data.atoms[bond.to].position}
          bondType={bond.type}
        />
      ))}

      {/* Render atoms */}
      {data.atoms.map((atom, index) => (
        <Atom
          key={`atom-${index}`}
          position={atom.position}
          element={atom.element}
          charge={showCharges ? atom.charge : undefined}
          selected={selectedAtom === index}
          onClick={() => setSelectedAtom(index)}
        />
      ))}

      {/* Show atom information if one is selected */}
      {selectedAtom !== null && (
        <Html
          position={[
            data.atoms[selectedAtom].position[0],
            data.atoms[selectedAtom].position[1] + 0.5,
            data.atoms[selectedAtom].position[2],
          ]}
        >
          <div className="bg-black/70 text-white p-2 rounded text-xs">
            <div>Element: {data.atoms[selectedAtom].element}</div>
            {showCharges && data.atoms[selectedAtom].charge !== 0 && (
              <div>
                Charge: {data.atoms[selectedAtom].charge > 0 ? "+" : "-"}
                {Math.abs(data.atoms[selectedAtom].charge || 0)}
              </div>
            )}
            <div>Bonds: {data.bonds.filter((b) => b.from === selectedAtom || b.to === selectedAtom).length}</div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Auto-rotation component
const AutoRotate = ({ speed = 0.5, enabled = true }) => {
  const { camera } = useThree()

  useFrame(({ clock }) => {
    if (enabled) {
      const t = clock.getElapsedTime()
      camera.position.x = Math.cos(t * speed) * 5
      camera.position.z = Math.sin(t * speed) * 5
      camera.lookAt(0, 0, 0)
    }
  })

  return null
}

// Main component
export function AdvancedMoleculeViewer({ smiles = "", height = 400 }: { smiles?: string; height?: number }) {
  const [moleculeData, setMoleculeData] = useState<MoleculeData | null>(null)
  const [displayMode, setDisplayMode] = useState("ball-and-stick")
  const [showCharges, setShowCharges] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [autoRotate, setAutoRotate] = useState(false)
  const [zoom, setZoom] = useState(1)

  // Parse SMILES to molecule data
  useEffect(() => {
    if (smiles) {
      const data = parseMockMolecule(smiles)
      setMoleculeData(data)
    }
  }, [smiles])

  // Default molecule if none provided
  useEffect(() => {
    if (!smiles) {
      // Aspirin SMILES
      const defaultSmiles = "CC(=O)OC1=CC=CC=C1C(=O)O"
      const data = parseMockMolecule(defaultSmiles)
      setMoleculeData(data)
    }
  }, [smiles])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2.5))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2 gap-2">
        <div className="flex items-center gap-2">
          <Select value={displayMode} onValueChange={setDisplayMode}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Display Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ball-and-stick">Ball and Stick</SelectItem>
              <SelectItem value="space-filling">Space Filling</SelectItem>
              <SelectItem value="wireframe">Wireframe</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Switch id="show-charges" checked={showCharges} onCheckedChange={setShowCharges} />
            <Label htmlFor="show-charges" className="text-xs">
              Charges
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setAutoRotate(!autoRotate)}
            className={autoRotate ? "bg-primary/20" : ""}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowLabels(!showLabels)}
            className={showLabels ? "bg-primary/20" : ""}
          >
            {showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-muted/30 rounded-md overflow-hidden relative">
        {moleculeData ? (
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            <Environment preset="studio" />

            <group scale={zoom}>
              <Molecule
                data={moleculeData}
                displayMode={displayMode}
                showCharges={showCharges}
                showLabels={showLabels}
              />
            </group>

            {autoRotate && <AutoRotate enabled={autoRotate} />}
          </Canvas>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading molecule...</p>
          </div>
        )}

        {/* Molecule info overlay */}
        {moleculeData && (
          <div className="absolute bottom-2 left-2 bg-background/80 p-2 rounded text-xs">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-[10px]">
                {moleculeData.atoms.length} atoms
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {moleculeData.bonds.length} bonds
              </Badge>
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground">Click on atoms for details</div>
          </div>
        )}
      </div>
    </div>
  )
}

