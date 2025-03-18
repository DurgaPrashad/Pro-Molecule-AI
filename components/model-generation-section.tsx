"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles } from "lucide-react"

export function ModelGenerationSection() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSmiles, setGeneratedSmiles] = useState("")

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      setGeneratedSmiles("CC1=C(C(=O)NC1=O)N2C=C(C=C2)C(=O)NC3=CC=C(C=C3)N4CCN(CC4)C")
    }, 3000)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Generate New Molecules</CardTitle>
          <CardDescription>Use AI models to generate novel drug candidates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select defaultValue="molbart">
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="molbart">MolBART</SelectItem>
                <SelectItem value="chemberta">ChemBERTa</SelectItem>
                <SelectItem value="transformer">Molecular Transformer</SelectItem>
                <SelectItem value="custom">Custom Model</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scaffold">Molecular Scaffold (SMILES)</Label>
            <Input id="scaffold" placeholder="C1=CC=CC=C1" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="diversity">Diversity</Label>
              <span className="text-sm text-muted-foreground">0.7</span>
            </div>
            <Slider defaultValue={[0.7]} min={0} max={1} step={0.1} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="properties">Target Properties</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="mw" className="text-xs">
                  Mol. Weight
                </Label>
                <Input id="mw" placeholder="500" size={5} className="h-8" />
              </div>
              <div>
                <Label htmlFor="logp" className="text-xs">
                  LogP
                </Label>
                <Input id="logp" placeholder="3.5" size={5} className="h-8" />
              </div>
              <div>
                <Label htmlFor="tpsa" className="text-xs">
                  TPSA
                </Label>
                <Input id="tpsa" placeholder="90" size={5} className="h-8" />
              </div>
              <div>
                <Label htmlFor="hba" className="text-xs">
                  H-Bond Acc.
                </Label>
                <Input id="hba" placeholder="5" size={5} className="h-8" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Molecules
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Results</CardTitle>
          <CardDescription>View and analyze generated molecules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="smiles">SMILES Notation</Label>
            <Textarea
              id="smiles"
              placeholder="Generated SMILES will appear here..."
              className="font-mono text-sm h-20"
              value={generatedSmiles}
              readOnly
            />
          </div>

          <div className="border rounded-md p-4 h-[200px] flex items-center justify-center bg-muted/50">
            {generatedSmiles ? (
              <div className="text-center">
                <div className="text-sm font-medium">Molecule Visualization</div>
                <div className="mt-2 text-xs text-muted-foreground">(Visualization would render here)</div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm">Generate a molecule to see visualization</div>
            )}
          </div>

          {generatedSmiles && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Predicted Properties</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mol. Weight:</span>
                  <span>487.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LogP:</span>
                  <span>3.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TPSA:</span>
                  <span>87.6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">H-Bond Acc.:</span>
                  <span>6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">H-Bond Don.:</span>
                  <span>2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rot. Bonds:</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" disabled={!generatedSmiles}>
            Save
          </Button>
          <Button variant="outline" disabled={!generatedSmiles}>
            Export
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

