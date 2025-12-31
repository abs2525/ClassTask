
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function fetchQuestions(): Promise<Question[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 10 interesting and verifiable trivia questions that can be answered with 'Yes' or 'No'. For each question, provide the question text, the boolean answer (true for Yes, false for No), and a brief, fun explanation for the answer.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: {
                    type: Type.STRING,
                    description: 'The trivia question text.',
                  },
                  answer: {
                    type: Type.BOOLEAN,
                    description: 'The answer to the question. True for Yes, False for No.',
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'A brief, fun explanation for the answer.'
                  }
                },
                required: ["question", "answer", "explanation"],
              },
            },
          },
          required: ["questions"],
        },
      },
    });

    const jsonString = response.text;
    if (!jsonString) {
        throw new Error("No response text from Gemini API");
    }

    const parsedResponse = JSON.parse(jsonString);
    return parsedResponse.questions;

  } catch (error) {
    console.error("Error fetching questions from Gemini API:", error);
    // As a fallback, return some hardcoded questions
    return [
        { question: 'Is the sky blue?', answer: true, explanation: 'The sky appears blue because of how the Earth\'s atmosphere scatters sunlight.' },
        { question: 'Is water a good conductor of electricity?', answer: false, explanation: 'Pure water is a poor conductor. It\'s the impurities and minerals in it that conduct electricity.' },
        { question: 'Was Cleopatra Egyptian?', answer: false, explanation: 'Cleopatra was of Greek descent, a member of the Ptolemaic dynasty.' },
    ];
  }
}
