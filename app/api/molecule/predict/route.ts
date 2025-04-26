import { NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Define the schema for property prediction
const predictionSchema = z.object({
  properties: z.array(
    z.object({
      name: z.string(),
      value: z.number(),
      unit: z.string(),
      description: z.string(),
    }),
  ),
  drug_likeness: z.object({
    score: z.number(),
    rules: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        passed: z.boolean(),
        value: z.number().optional(),
        threshold: z.number().optional(),
      }),
    ),
  }),
  bioactivity: z.object({
    targets: z.array(
      z.object({
        name: z.string(),
        activity: z.number(),
        confidence: z.number(),
      }),
    ),
  }),
  toxicity: z.object({
    score: z.number(),
    alerts: z.array(z.string()),
  }),
})

export async function POST(request: Request) {
  try {
    const { smiles, model, targets } = await request.json()

    // Validate inputs
    if (!smiles) {
      return NextResponse.json({ success: false, error: "SMILES notation is required" }, { status: 400 })
    }

    // Construct the prompt for property prediction
    const prompt = `
      Analyze the following molecule SMILES and predict its properties:
      ${smiles}
      
      ${targets ? `Focus on these biological targets: ${targets.join(", ")}` : ""}
      
      Return a comprehensive analysis including physicochemical properties, drug-likeness,
      bioactivity predictions, and toxicity alerts.
    `

    // Use AI SDK to generate structured prediction
    const { object: prediction } = await generateObject({
      model: openai("gpt-4o"),
      schema: predictionSchema,
      prompt,
    })

    return NextResponse.json({
      success: true,
      prediction,
    })
  } catch (error) {
    console.error("Error predicting properties:", error)
    return NextResponse.json({ success: false, error: "Failed to predict properties" }, { status: 500 })
  }
}

