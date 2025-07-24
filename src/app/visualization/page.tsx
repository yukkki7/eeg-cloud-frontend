// src/app/visualization/page.tsx
"use client";

import React from "react";
import { parseEEGColumnar } from "@/data/parseEEG";
import { mock6D } from "@/data/mockEEG6";
import { StarGlyph } from "@/components/StarGlyph";

export default function VisualizationPage() {
  // Parse the 6-dimension mock EEG data
  const raw = mock6D;
  const data = parseEEGColumnar(raw);

  return (
    <div className="w-full min-h-screen bg-white px-6 py-8">
      <div className="max-w-screen-lg mx-auto">
        {/* Page title */}
        <h1 className="text-2xl font-bold mb-6">
          Star-Glyph (Petal) Visualization
        </h1>

        {/* Render the star glyph at 500px */}
        <div className="flex justify-center">
          <StarGlyph data={data} size={500} />
        </div>
      </div>
    </div>
  );
}
