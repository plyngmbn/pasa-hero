/**
 * Copyright 2026 Google LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for vehicle tracking
app.post("/api/track-vehicle", async (req, res) => {
  const { code } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a realistic but random jeepney or bus commute route in Metro Manila for a vehicle with code/plate "${code}". 
      The response must be a JSON object with the following structure:
      {
        "type": "jeepney" or "bus",
        "route": "Name of the route (e.g. Cubao - Taft)",
        "plate": "${code}",
        "status": "In Transit" or "Approaching" or "Delayed",
        "occupancy": "Percentage full (e.g. 70% Full)",
        "nextStop": "A real landmark or street in Manila",
        "eta": "Estimated time (e.g. 4 mins)",
        "latlng": [latitude, longitude],
        "path": [[lat, lng], [lat, lng], ...] // At least 4 points forming a path
      }
      Ensure the coordinates are within Metro Manila (around 14.6, 121.0).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            route: { type: Type.STRING },
            plate: { type: Type.STRING },
            status: { type: Type.STRING },
            occupancy: { type: Type.STRING },
            nextStop: { type: Type.STRING },
            eta: { type: Type.STRING },
            latlng: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER }
            },
            path: {
              type: Type.ARRAY,
              items: {
                type: Type.ARRAY,
                items: { type: Type.NUMBER }
              }
            }
          },
          required: ["type", "route", "plate", "status", "occupancy", "nextStop", "eta", "latlng", "path"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to fetch vehicle tracking data" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
