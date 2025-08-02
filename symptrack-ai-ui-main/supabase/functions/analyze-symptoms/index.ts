import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "npm:@google/generative-ai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { symptoms } = await req.json()

    if (!symptoms) {
      return new Response(
        JSON.stringify({ error: 'Symptoms are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the API key from Supabase secrets
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const systemPrompt = `You are a medical note analyzer assistant. The user is pretending to be a patient and has written their symptoms below. Based on this note:

1. Predict the possible disease.
2. Label the risk as "High Risk", "Low Risk", or "Neutral".
3. Suggest which hospital department the patient should visit (if necessary).
4. Mention possible medications (for general understanding only).
5. Provide practical suggestions for quick recovery with minimal effort or harm.

Do not respond with excessively long messages.
Your answer should be medically reasonable, informative, and easy to understand.

IMPORTANT: Start your response with "DISEASE: [disease name]" and "RISK: [risk level]" on separate lines, then continue with your analysis.

Patient note: `

    const result = await model.generateContent(systemPrompt + symptoms)
    const response = await result.response
    const text = response.text()

    // Parse the response to extract disease and risk
    const lines = text.split('\n')
    let disease = "Unknown Condition"
    let risk: "High Risk" | "Low Risk" | "Neutral" = "Neutral"

    for (const line of lines) {
      if (line.startsWith("DISEASE:")) {
        disease = line.replace("DISEASE:", "").trim()
      } else if (line.startsWith("RISK:")) {
        const riskText = line.replace("RISK:", "").trim()
        if (riskText.toLowerCase().includes("high")) risk = "High Risk"
        else if (riskText.toLowerCase().includes("low")) risk = "Low Risk"
        else risk = "Neutral"
      }
    }

    // Remove the DISEASE: and RISK: lines from the display text
    const cleanedText = text.replace(/^DISEASE:.*\n?/gm, '').replace(/^RISK:.*\n?/gm, '').trim()

    return new Response(
      JSON.stringify({
        disease,
        risk,
        analysis: cleanedText,
        fullResponse: text
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to analyze symptoms' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})