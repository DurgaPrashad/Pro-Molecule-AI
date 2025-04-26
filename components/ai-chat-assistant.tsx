"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, Sparkles, FileText, Lightbulb, Database, Beaker } from "lucide-react"
import { AdvancedMoleculeViewer } from "@/components/advanced-molecule-viewer"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  attachments?: {
    type: "molecule" | "paper" | "data"
    content: string
    description?: string
  }[]
}

interface Suggestion {
  id: string
  text: string
  icon: React.ReactNode
}

// Mock function to simulate AI response
const generateAIResponse = async (message: string, history: Message[]): Promise<Message> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Check for molecule-related queries
  const isMoleculeQuery = /molecule|compound|drug|smiles|structure/i.test(message)
  const isPaperQuery = /paper|research|publication|literature|study/i.test(message)
  const isDataQuery = /data|database|dataset|statistics/i.test(message)

  let response = ""
  let attachments: Message["attachments"] = []

  if (isMoleculeQuery) {
    response =
      "Based on your query, I've generated a potential molecule that could serve as a starting point. This compound has favorable drug-like properties with a predicted LogP of 3.2 and molecular weight of 357.4 g/mol. Would you like me to optimize it further for specific targets or properties?"
    attachments = [
      {
        type: "molecule",
        content: "CC1=C(C(=O)NC1=O)N2C=C(C=C2)C(=O)NC3=CC=C(C=C3)N4CCN(CC4)C",
        description: "Generated molecule with predicted binding to EGFR",
      },
    ]
  } else if (isPaperQuery) {
    response =
      "I found several relevant research papers that might help with your query. The most recent one from Journal of Medicinal Chemistry discusses novel scaffolds for kinase inhibitors with improved selectivity profiles. Would you like me to summarize the key findings?"
    attachments = [
      {
        type: "paper",
        content: "Novel Scaffolds for Kinase Inhibitors with Improved Selectivity Profiles",
        description: "Journal of Medicinal Chemistry, 2023",
      },
    ]
  } else if (isDataQuery) {
    response =
      "I've queried the ChEMBL and DrugBank databases and found 157 compounds that match your criteria. The data shows a distribution of activity values ranging from 5.2 to 9.8 pIC50. Would you like me to analyze this dataset for structure-activity relationships?"
    attachments = [
      {
        type: "data",
        content: "157 compounds with activity data",
        description: "Data from ChEMBL and DrugBank",
      },
    ]
  } else {
    response =
      "I'm your AI drug discovery assistant. I can help with molecular design, property prediction, literature search, and data analysis. What specific aspect of drug discovery are you working on today?"
  }

  return {
    id: Date.now().toString(),
    role: "assistant",
    content: response,
    timestamp: new Date(),
    attachments,
  }
}

export function AIChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI drug discovery assistant. I can help with molecular design, property prediction, literature search, and data analysis. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const aiResponse = await generateAIResponse(input, messages)
      setMessages((prev) => [...prev, aiResponse])

      // If response contains a molecule, select it for visualization
      if (aiResponse.attachments?.some((a) => a.type === "molecule")) {
        const molecule = aiResponse.attachments.find((a) => a.type === "molecule")
        if (molecule) {
          setSelectedMolecule(molecule.content)
          setActiveTab("molecule")
        }
      }
    } catch (error) {
      console.error("Error generating AI response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Predefined suggestions
  const suggestions: Suggestion[] = [
    {
      id: "1",
      text: "Design a molecule similar to imatinib but with better selectivity",
      icon: <Beaker className="h-4 w-4" />,
    },
    {
      id: "2",
      text: "Find recent papers on EGFR inhibitors",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "3",
      text: "Analyze this SMILES: CC(=O)OC1=CC=CC=C1C(=O)O",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      id: "4",
      text: "Query ChEMBL for JAK inhibitors",
      icon: <Database className="h-4 w-4" />,
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>AI Research Assistant</CardTitle>
          <CardDescription>Collaborate with AI to accelerate your drug discovery research</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className="h-8 w-8">
                      {message.role === "assistant" ? (
                        <>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>AI</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>You</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div className="space-y-2">
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "assistant"
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>

                      {message.attachments && message.attachments.length > 0 && (
                        <div className="space-y-2">
                          {message.attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="bg-muted/50 rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:bg-muted/70"
                              onClick={() => {
                                if (attachment.type === "molecule") {
                                  setSelectedMolecule(attachment.content)
                                  setActiveTab("molecule")
                                }
                              }}
                            >
                              {attachment.type === "molecule" && <Beaker className="h-4 w-4 text-blue-500" />}
                              {attachment.type === "paper" && <FileText className="h-4 w-4 text-purple-500" />}
                              {attachment.type === "data" && <Database className="h-4 w-4 text-green-500" />}
                              <div className="text-xs">
                                <div className="font-medium">
                                  {attachment.type.charAt(0).toUpperCase() + attachment.type.slice(1)}
                                </div>
                                {attachment.description && (
                                  <div className="text-muted-foreground">{attachment.description}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="flex flex-wrap gap-2 w-full">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion.id}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-1.5"
                onClick={() => setInput(suggestion.text)}
              >
                {suggestion.icon}
                <span className="ml-1">{suggestion.text}</span>
              </Button>
            ))}
          </div>
          <div className="flex w-full items-center space-x-2">
            <Textarea
              placeholder="Ask about molecular design, properties, or literature..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px]"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Research Tools</CardTitle>
          <CardDescription>Analyze and visualize research data</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="molecule">Molecule</TabsTrigger>
              <TabsTrigger value="papers">Papers</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="p-4">
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    Research Tips
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li>Ask the AI to design molecules with specific properties</li>
                    <li>Request literature searches for recent publications</li>
                    <li>Analyze SMILES notations for drug-likeness</li>
                    <li>Query biomedical databases for similar compounds</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recent Queries</h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="mr-2">
                      EGFR inhibitors
                    </Badge>
                    <Badge variant="outline" className="mr-2">
                      Solubility prediction
                    </Badge>
                    <Badge variant="outline">JAK2 selectivity</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="molecule" className="p-4">
              {selectedMolecule ? (
                <div className="space-y-4">
                  <div className="h-[300px]">
                    <AdvancedMoleculeViewer smiles={selectedMolecule} height={300} />
                  </div>
                  <div className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto">{selectedMolecule}</div>
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      Save Molecule
                    </Button>
                    <Button variant="outline" size="sm">
                      Analyze Properties
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <Beaker className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Molecule Selected</h3>
                  <p className="text-sm text-muted-foreground mt-2">Ask the AI to generate or analyze a molecule</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="papers" className="p-4">
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Recent Papers</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium">
                        Novel Scaffolds for Kinase Inhibitors with Improved Selectivity Profiles
                      </div>
                      <div className="text-xs text-muted-foreground">Journal of Medicinal Chemistry, 2023</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">AI-Driven Discovery of Selective EGFR Inhibitors</div>
                      <div className="text-xs text-muted-foreground">Nature Chemical Biology, 2023</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Structure-Based Design of Allosteric Protein Kinase Inhibitors
                      </div>
                      <div className="text-xs text-muted-foreground">ACS Medicinal Chemistry Letters, 2022</div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Search Literature
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

