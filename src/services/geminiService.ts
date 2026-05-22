/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { CommuteRoute, TransportType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const ROUTE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      summary: { type: Type.STRING },
      totalDuration: { type: Type.NUMBER },
      totalFare: { type: Type.NUMBER },
      difficulty: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
      transfers: { type: Type.NUMBER },
      steps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ["jeepney", "bus", "mrt", "lrt", "uv-express", "tricycle", "walking", "ride-hailing"] },
            instruction: { type: Type.STRING },
            shortLabel: { type: Type.STRING },
            duration: { type: Type.NUMBER },
            fare: { type: Type.NUMBER },
            highlight: { type: Type.STRING },
            provider: { type: Type.STRING }
          },
          required: ["type", "instruction", "duration"]
        }
      }
    },
    required: ["id", "summary", "totalDuration", "totalFare", "difficulty", "transfers", "steps"]
  }
};

export async function getSmartRoutes(origin: string, destination: string): Promise<CommuteRoute[]> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  const prompt = `You are a Metro Manila commute expert. 
Calculate the best commute routes from "${origin}" to "${destination}".
Return exactly 4 options:
1. Fastest public transit route.
2. Cheapest public transit route.
3. A Ride-hailing option (e.g., Grab Car or JoyRide Car).
4. A Motorcycle ride-hailing option (e.g., Angkas or JoyRide Moto).

Include specific Public Utility Vehicles (PUVs) such as:
- Jeepneys
- Buses (EDSA Bus Carousel, P2P)
- UV Express
- Trains (MRT-3, LRT-1, LRT-2)
- Tricycles
- Ride-hailing services (Grab, JoyRide, Angkas).

For ride-hailing options:
- Set type to "ride-hailing".
- Specify the provider (Grab, JoyRide, Angkas) in the "provider" field.
- Provide a realistic estimated fare based on distance and standard Metro Manila rates.
- Provide a realistic estimated arrival time (duration).

Consider current Metro Manila traffic norms and realistic fare rates (Jeepney base fare ~P13).
Ensure the summary is concise.
Provide specific instructions for boarding and transfers.

Return the data as an array of routes matching the schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ROUTE_SCHEMA,
        temperature: 0.1, // Low temperature for consistency
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const routes = JSON.parse(text) as CommuteRoute[];
    return routes;
  } catch (error) {
    console.error("Gemini Route Planning Error:", error);
    throw error;
  }
}
