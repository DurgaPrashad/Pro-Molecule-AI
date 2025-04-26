import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()

    // Validate inputs
    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    // Format the conversation history for the AI
    const formattedHistory = history
      .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n\n")

    // Construct the prompt for the AI assistant
    const prompt = `
      You are an AI assistant specialized in drug discovery and medicinal chemistry.
      
      Previous conversation:
      ${formattedHistory}
      
      User: ${message}
      
      Provide a helpful response related to drug discovery. If the query is about molecular design,
      include a valid SMILES notation for any molecules you suggest. If it's about literature,
      include relevant paper references. If it's about data analysis, provide insights based on
      biomedical databases.
      
      Assistant:
    `

    // Use AI SDK to generate response
    const { text: response } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Process the response to extract any SMILES notations, paper references, or data insights
    const attachments = []

    // Check for SMILES notation (simplified pattern matching)
    const smilesMatch = response.match(/([A-Za-z0-9$$$$[\].=#\-+\\/@%*:]+)/)
    if (smilesMatch && smilesMatch[0].length > 10) {
      attachments.push({
        type: "molecule",
        content: smilesMatch[0],
        description: "Generated molecule",
      })
    }

    // Check for paper references
    const paperMatch = response.match(/([A-Za-z\s]+),\s+(\d{4})/)
    if (paperMatch) {
      attachments.push({
        type: "paper",
        content: paperMatch[0],
        description: "Research paper",
      })
    }

    // Check for database references
    if (response.includes("ChEMBL") || response.includes("DrugBank") || response.includes("PubChem")) {
      attachments.push({
        type: "data",
        content: "Biomedical database results",
        description: "Data from biomedical databases",
      })
    }

    return NextResponse.json({
      success: true,
      response: {
        content: response,
        attachments,
      },
    })
  } catch (error) {
    console.error("Error generating chat response:", error)
    return NextResponse.json({ success: false, error: "Failed to generate response" }, { status: 500 })
  }
}

