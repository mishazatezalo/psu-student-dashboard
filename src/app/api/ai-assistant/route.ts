import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

async function fetchCanvasAssignments() {
  try {
    const response = await fetch('http://localhost:3000/api/canvas')
    const assignments = await response.json()
    return Array.isArray(assignments) ? assignments : []
  } catch (error) {
    console.error('Error fetching Canvas assignments:', error)
    return []
  }
}

export async function GET() {
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.error('Google AI API key is not set')
    return NextResponse.json({ error: 'Google AI API key is not configured' }, { status: 500 })
  }

  try {
    const assignments = await fetchCanvasAssignments()
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    let assignmentContext = "You have no upcoming assignments."
    if (assignments.length > 0) {
      const nextAssignment = assignments[0]
      assignmentContext = `Your next assignment "${nextAssignment.name}" for ${nextAssignment.course_name} is due ${new Date(nextAssignment.due_at).toLocaleDateString()}.`
    }

    const prompt = `You are an AI assistant for a student task management app. Based on this context: "${assignmentContext}", provide:
    1. A short, encouraging, fun greeting (1 sentence)
    2. A brief task suggestion related to the assignment or studying (1 sentence)
    Format your response as JSON with 'greeting' and 'taskSuggestion' fields.`

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    const jsonContent = text.replace(/```json|```/g, '').trim();
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      parsedResponse = {
        greeting: "Welcome back! Ready to tackle your assignments?",
        taskSuggestion: "Add a task to start working on your next assignment."
      };
    }

    return NextResponse.json({
      greeting: parsedResponse.greeting || "Welcome back! Ready to tackle your assignments?",
      taskSuggestion: parsedResponse.taskSuggestion || "Add a task to start working on your next assignment."
    })
  } catch (error) {
    console.error('Error calling Google AI API:', error)
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 })
  }
}

