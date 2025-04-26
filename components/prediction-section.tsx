"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Target } from "lucide-react"

export function PredictionSection() {
  const [isPredicting, setIsPredicting] = useState(false)
  const [predictionResults, setPredictionResults] = useState("")

  const handlePredict = () => {
    setIsPredicting(true)
    // Simulate API call
    setTimeout(() => {
      setIsPredicting(false)
      setPredictionResults(
        JSON.stringify(
          {
            binding_affinity: -8.7,
            confidence: 0.92,
            interactions: [
              { type: "hydrogen_bond", residue: "ASP93", distance: 2.1 },
              { type: "hydrophobic", residue: "LEU95", distance: 3.5 },
              { type: "pi_stacking", residue: "PHE120", distance: 3.8 },
            ],
          },
          null,
          2,
        ),
      )
    }, 3000)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Predict Drug-Target Interactions</CardTitle>
          <CardDescription>Use AI models to predict how molecules interact with targets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prediction-model">Prediction Model</Label>
            <Select defaultValue="alphafold">
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphafold">AlphaFold</SelectItem>
                <SelectItem value="autodock">AutoDock Vina</SelectItem>
                <SelectItem value="deepdta">DeepDTA</SelectItem>
                <SelectItem value="custom">Custom Model</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="molecule">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="molecule">Molecule</TabsTrigger>
              <TabsTrigger value="target">Target</TabsTrigger>
            </TabsList>
            <TabsContent value="molecule" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smiles-input">SMILES Notation</Label>
                <Textarea
                  id="smiles-input"
                  placeholder="Enter SMILES notation..."
                  className="font-mono text-sm h-20"
                  defaultValue="CC1=C(C(=O)NC1=O)N2C=C(C=C2)C(=O)NC3=CC=C(C=C3)N4CCN(CC4)C"
                />
              </div>
              <div className="space-y-2">
                <Label>Or Upload Molecule File</Label>
                <div className="flex items-center gap-2">
                  <Input type="file" className="text-sm" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="target" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target-select">Select Target</Label>
                <Select defaultValue="egfr">
                  <SelectTrigger>
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="egfr">EGFR (Epidermal Growth Factor Receptor)</SelectItem>
                    <SelectItem value="her2">HER2 (Human Epidermal Growth Factor Receptor 2)</SelectItem>
                    <SelectItem value="ace2">ACE2 (Angiotensin-Converting Enzyme 2)</SelectItem>
                    <SelectItem value="custom">Custom Target</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Or Upload PDB File</Label>
                <div className="flex items-center gap-2">
                  <Input type="file" className="text-sm" />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="parameters">Advanced Parameters</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="exhaustiveness" className="text-xs">
                  Exhaustiveness
                </Label>
                <Input id="exhaustiveness" placeholder="8" size={5} className="h-8" />
              </div>
              <div>
                <Label htmlFor="energy-range" className="text-xs">
                  Energy Range
                </Label>
                <Input id="energy-range" placeholder="3" size={5} className="h-8" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handlePredict} disabled={isPredicting}>
            {isPredicting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              <>
                <Target className="mr-2 h-4 w-4" />
                Predict Interactions
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prediction Results</CardTitle>
          <CardDescription>View and analyze prediction results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="results">Binding Prediction</Label>
            <Textarea
              id="results"
              placeholder="Prediction results will appear here..."
              className="font-mono text-sm h-[150px]"
              value={predictionResults}
              readOnly
            />
          </div>

          <div className="border rounded-md p-4 h-[200px] flex items-center justify-center bg-muted/50">
            {predictionResults ? (
              <div className="text-center">
                <div className="text-sm font-medium">3D Interaction Visualization</div>
                <div className="mt-2 text-xs text-muted-foreground">(3D visualization would render here)</div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm">Run a prediction to see visualization</div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" disabled={!predictionResults}>
            Save
          </Button>
          <Button variant="outline" disabled={!predictionResults}>
            Export
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

