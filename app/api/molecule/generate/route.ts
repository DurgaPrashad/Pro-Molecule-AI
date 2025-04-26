import { NextResponse } from "next/server"
import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Define the schema for molecule generation
const moleculeSchema = z.object({
  smiles: z.string(),
  properties: z.object({
    molecular_weight: z.number(),
    logp: z.number(),
    tpsa: z.number(),
    h_bond_donors: z.number(),
    h_bond_acceptors: z.number(),
    rotatable_bonds: z.number(),
    aromatic_rings: z.number(),
  }),
  drug_likeness: z.object({
    score: z.number(),
    lipinski_violations: z.number(),
    veber_violations: z.number(),
  }),
})

export async function POST(request: Request) {
  try {
    const { model, scaffold, properties, diversity } = await request.json()

    // Validate inputs
    if (!model) {
      return NextResponse.json({ success: false, error: "Model is required" }, { status: 400 })
    }

    // Construct the prompt for molecule generation
    const prompt = `
      Generate a novel drug molecule with the following properties:
      ${scaffold ? `Based on scaffold: ${scaffold}` : ""}
      ${properties?.mw ? `Molecular weight around: ${properties.mw}` : ""}
      ${properties?.logp ? `LogP around: ${properties.logp}` : ""}
      ${properties?.tpsa ? `TPSA around: ${properties.tpsa}` : ""}
      ${properties?.hba ? `H-Bond acceptors around: ${properties.hba}` : ""}
      Diversity parameter: ${diversity || 0.7}
      
      Return a valid SMILES notation for a drug-like molecule.
    `

    // Use AI SDK to generate SMILES
    const { text: smiles } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Now use AI SDK to generate structured properties for the molecule
    const propertyPrompt = `
      Analyze the following molecule SMILES and predict its physicochemical properties:
      ${smiles.trim()}
      
      Return a JSON object with the molecular properties, including molecular_weight, logp, tpsa,
      h_bond_donors, h_bond_acceptors, rotatable_bonds, aromatic_rings, and drug_likeness metrics.
    `

    const { object: moleculeProperties } = await generateObject({
      model: openai("gpt-4o"),
      schema: moleculeSchema,
      prompt: propertyPrompt,
    })

    return NextResponse.json({
      success: true,
      molecule: {
        smiles: smiles.trim(),
        properties: moleculeProperties.properties,
        drug_likeness: moleculeProperties.drug_likeness,
      },
    })
  } catch (error) {
    console.error("Error generating molecule:", error)
    return NextResponse.json({ success: false, error: "Failed to generate molecule" }, { status: 500 })
  }
}

