import { GoogleGenAI, Type } from "@google/genai";
import { Dilemma, CraftElement } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const streamExplanation = async (topic: string): Promise<AsyncIterable<string>> => {
  const model = "gemini-3-flash-preview";
  
  try {
    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: `Explain "${topic}" to me like I am a 5 year old. Use simple words, analogies, and lots of emojis. Keep it under 150 words. Be witty and fun.`,
      config: {
        temperature: 0.7,
      }
    });

    // Create a generator that yields text chunks
    async function* textGenerator() {
      for await (const chunk of responseStream) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    }

    return textGenerator();

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateDilemma = async (): Promise<Dilemma> => {
  const model = "gemini-3-flash-preview";

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: "Generate a funny, absurd, or philosophical 'would you rather' dilemma. It should be difficult but amusing. Make sure the options are distinct.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING, description: "The context of the dilemma" },
            optionA: { type: Type.STRING, description: "The first choice" },
            optionB: { type: Type.STRING, description: "The second choice" }
          },
          required: ["scenario", "optionA", "optionB"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Dilemma;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini Dilemma Error", error);
    // Fallback if API fails
    return {
      scenario: "The AI is taking a nap. You must decide:",
      optionA: "Wait patiently",
      optionB: "Refresh the page"
    };
  }
};

export const combineElements = async (elem1: string, elem2: string): Promise<CraftElement> => {
  const model = "gemini-3-flash-preview";

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Combine "${elem1}" and "${elem2}" to create a new single concept, object, or entity. 
      It should be a creative but logical combination (e.g., Water + Fire = Steam, Steam + Air = Cloud).
      If the combination makes no sense, return "Nothing".
      Return a JSON object with 'name' and 'emoji'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "The name of the result" },
            emoji: { type: Type.STRING, description: "A single emoji representing the result" }
          },
          required: ["name", "emoji"]
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text) as CraftElement;
      return result;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Craft Error", error);
    return { name: "Glitch", emoji: "👾" };
  }
};