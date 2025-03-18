"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, BarChart, AlertTriangle, Check, X } from "lucide-react"
import { AdvancedMoleculeViewer } from "@/components/advanced-molecule-viewer"

interface PropertyPrediction {
  name: string
  value: number
  unit: string
  optimal_range?: [number, number]
  description: string
}

interface DrugLikenessRule {
  name: string
  description: string
  passed: boolean
  value?: number
  threshold?: number
}

interface PredictionResult {
  properties: PropertyPrediction[]
  drug_likeness: {
    score: number
    rules: DrugLikenessRule[]
  }
  bioactivity: {
    targets: Array<{
      name: string
      activity: number
      confidence: number
    }>
  }
  toxicity: {
    score: number
    alerts: string[]
  }
}

// Mock prediction function (in a real app, this would call the backend API)
const predictProperties = async (smiles: string, model: string): Promise<PredictionResult> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock data
  return {
    properties: [
      {
        name: "Molecular Weight",
        value: 357.4,
        unit: "g/mol",
        optimal_range: [200, 500],
        description: "Total weight of the molecule",
      },
      {
        name: "LogP",
        value: 3.2,
        unit: "",
        optimal_range: [0, 5],
        description: "Octanol-water partition coefficient",
      },
      {
        name: "TPSA",
        value: 87.6,
        unit: "Å²",
        optimal_range: [40, 140],
        description: "Topological polar surface area",
      },
      {
        name: "H-Bond Acceptors",
        value: 6,
        unit: "",
        optimal_range: [0, 10],
        description: "Number of hydrogen bond acceptors",
      },
      {
        name: "H-Bond Donors",
        value: 2,
        unit: "",
        optimal_range: [0, 5],
        description: "Number of hydrogen bond donors",
      },
      {
        name: "Rotatable Bonds",
        value: 5,
        unit: "",
        optimal_range: [0, 10],
        description: "Number of rotatable bonds",
      },
      {
        name: "Solubility",
        value: -3.8,
        unit: "logS",
        optimal_range: [-5, 0],
        description: "Aqueous solubility",
      },
    ],
    drug_likeness: {
      score: 0.82,
      rules: [
        {
          name: "Lipinski's Rule of Five",
          description: "Molecular properties important for a drug's pharmacokinetics",
          passed: true,
        },
        {
          name: "Molecular Weight",
          description: "MW ≤ 500",
          passed: true,
          value: 357.4,
          threshold: 500,
        },
        {
          name: "LogP",
          description: "LogP ≤ 5",
          passed: true,
          value: 3.2,
          threshold: 5,
        },
        {
          name: "H-Bond Donors",
          description: "HBD ≤ 5",
          passed: true,
          value: 2,
          threshold: 5,
        },
        {
          name: "H-Bond Acceptors",
          description: "HBA ≤ 10",
          passed: true,
          value: 6,
          threshold: 10,
        },
        {
          name: "Veber's Rule",
          description: "Restrictions on molecular flexibility and polar surface area",
          passed: true,
        },
        {
          name: "PAINS Filters",
          description: "Filters for pan-assay interference compounds",
          passed: true,
        },
      ],
    },
    bioactivity: {
      targets: [
        {
          name: "EGFR",
          activity: 7.2,
          confidence: 0.85,
        },
        {
          name: "HER2",
          activity: 5.8,
          confidence: 0.72,
        },
        {
          name: "ACE2",
          activity: 4.3,
          confidence: 0.65,
        },
      ],
    },
    toxicity: {
      score: 0.35,
      alerts: ["Potential hepatotoxicity at high doses", "Low risk of cardiotoxicity"],
    },
  }
}

export function AIPropertyPrediction() {
  const [smiles, setSmiles] = useState("CC1=C(C(=O)NC1=O)N2C=C(C=C2)C(=O)NC3=CC=C(C=C3)N4CCN(CC4)C")
  const [model, setModel] = useState("deepchem")
  const [isPredicting, setIsPredicting] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [activeTab, setActiveTab] = useState("properties")

  const handlePredict = async () => {
    if (!smiles) return

    setIsPredicting(true)
    try {
      const result = await predictProperties(smiles, model)
      setPrediction(result)
      setActiveTab("properties")
    } catch (error) {
      console.error("Error predicting properties:", error)
    } finally {
      setIsPredicting(false)
    }
  }

  // Property visualization component
  const PropertyVisualizer = ({ property }: { property: PropertyPrediction }) => {
    if (!property.optimal_range) return null

    const [min, max] = property.optimal_range
    const range = max - min
    const position = Math.max(0, Math.min(100, ((property.value - min) / range) * 100))

    const isInRange = property.value >= min && property.value <= max

    return (
      <div className="mt-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {min} {property.unit}
          </span>
          <span>
            {max} {property.unit}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full relative">
          <div
            className={`absolute h-4 w-4 rounded-full top-1/2 -translate-y-1/2 -ml-2 ${isInRange ? "bg-green-500" : "bg-red-500"}`}
            style={{ left: `${position}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Property Prediction</CardTitle>
          <CardDescription>Predict molecular properties using advanced AI models</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model-select">AI Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deepchem">DeepChem</SelectItem>
                <SelectItem value="chemberta">ChemBERTa</SelectItem>
                <SelectItem value="molbart">MolBART</SelectItem>
                <SelectItem value="ensemble">AI Ensemble (Highest Accuracy)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="smiles-input">SMILES Notation</Label>
            <Textarea
              id="smiles-input"
              placeholder="Enter SMILES notation..."
              className="font-mono text-sm h-20"
              value={smiles}
              onChange={(e) => setSmiles(e.target.value)}
            />
          </div>

          <div className="h-[250px]">
            <AdvancedMoleculeViewer smiles={smiles} height={250} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handlePredict} disabled={isPredicting || !smiles}>
            {isPredicting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Predict Properties
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prediction Results</CardTitle>
          <CardDescription>Comprehensive analysis of molecular properties</CardDescription>
        </CardHeader>
        <CardContent>
          {prediction ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="druglikeness">Drug-likeness</TabsTrigger>
                <TabsTrigger value="bioactivity">Bioactivity</TabsTrigger>
                <TabsTrigger value="toxicity">Toxicity</TabsTrigger>
              </TabsList>

              <TabsContent value="properties" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 gap-4">
                  {prediction.properties.map((property, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm">{property.name}</div>
                        <div className="text-sm">
                          {property.value} {property.unit}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{property.description}</div>
                      <PropertyVisualizer property={property} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="druglikeness" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Drug-likeness Score</div>
                    <div className="text-xs text-muted-foreground">Overall compliance with drug-likeness rules</div>
                  </div>
                  <div className="text-2xl font-bold">{(prediction.drug_likeness.score * 100).toFixed(0)}%</div>
                </div>

                <Progress value={prediction.drug_likeness.score * 100} className="h-2" />

                <div className="space-y-3 mt-4">
                  {prediction.drug_likeness.rules.map((rule, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className={`mt-0.5 ${rule.passed ? "text-green-500" : "text-red-500"}`}>
                        {rule.passed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{rule.name}</div>
                        <div className="text-xs text-muted-foreground">{rule.description}</div>
                        {rule.value !== undefined && rule.threshold !== undefined && (
                          <div className="text-xs">
                            Value: {rule.value} (Threshold: {rule.threshold})
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bioactivity" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {prediction.bioactivity.targets.map((target, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{target.name}</div>
                        <Badge variant={target.activity > 6 ? "default" : "secondary"}>
                          pActivity: {target.activity.toFixed(1)}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Confidence: {(target.confidence * 100).toFixed(0)}%</span>
                          <span className="text-muted-foreground">
                            {target.activity > 7
                              ? "High activity"
                              : target.activity > 5
                                ? "Moderate activity"
                                : "Low activity"}
                          </span>
                        </div>
                        <Progress value={target.activity * 10} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-muted/30 p-3 rounded-md text-sm mt-4">
                  <div className="font-medium mb-1">Interpretation</div>
                  <p className="text-xs text-muted-foreground">
                    pActivity values represent -log(Ki/Kd/IC50/EC50). Higher values indicate stronger binding. Values
                    above 7 typically indicate high potency compounds.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="toxicity" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Toxicity Risk Score</div>
                    <div className="text-xs text-muted-foreground">Predicted toxicity profile</div>
                  </div>
                  <div>
                    <Badge variant={prediction.toxicity.score < 0.4 ? "outline" : "destructive"}>
                      {prediction.toxicity.score < 0.3
                        ? "Low Risk"
                        : prediction.toxicity.score < 0.6
                          ? "Moderate Risk"
                          : "High Risk"}
                    </Badge>
                  </div>
                </div>

                <Progress
                  value={prediction.toxicity.score * 100}
                  className={`h-2 ${
                    prediction.toxicity.score < 0.3
                      ? "bg-green-500"
                      : prediction.toxicity.score < 0.6
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />

                <div className="space-y-2 mt-4">
                  <div className="font-medium text-sm">Toxicity Alerts</div>
                  {prediction.toxicity.alerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>{alert}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Prediction Data</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Enter a SMILES notation and click "Predict Properties" to analyze the molecule.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

