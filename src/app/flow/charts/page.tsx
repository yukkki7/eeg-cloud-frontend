// src/app/flow/charts/page.tsx
"use client";

import React, { useRef, useState } from "react";
import { EEGChart } from "@/components/EEGChart";
import { EEGPolygonChart } from "@/components/EEGPolygonChart";

export default function ChartsPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // NEW: State for the shared timestamp, initialized to 15s.
  const [sharedTimestamp, setSharedTimestamp] = useState(15);

  // This function is called when a point on the line chart is clicked.
  const handlePointClick = (sec: number) => {
    // It updates the shared state for the radar chart.
    setSharedTimestamp(sec);

    const vid = videoRef.current;
    if (!vid) return;

    // It also seeks the video, but only for the available portion.
    if (sec <= 15) {
      vid.currentTime = sec;
      vid.play();
    } else {
      alert("Video unavailable for this time");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-4 py-6">
      <div className="max-w-screen-2xl mx-auto space-y-8">
        {/* Participant Video */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-black">
            Participant Video
          </h2>
          <div className="w-full h-96 bg-black rounded-lg overflow-hidden shadow-inner">
            <video
              ref={videoRef}
              src="/test_video.mp4"
              controls
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* EEG Visualizations */}
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-black">
            EEG Visualizations
          </h2>
          <div className="w-full flex gap-6">
            {/* Line Plot (6 parts) */}
            <div className="flex-[6] bg-gray-50 p-4 rounded-lg shadow-sm h-[44rem] flex flex-col">
              <h3 className="text-lg font-medium mb-2 text-center text-black">
                Line Plot
              </h3>
              <div className="flex-1">
                <EEGChart onPointClick={handlePointClick} />
              </div>
            </div>

            {/* Polygon Chart (4 parts) */}
            <div className="flex-[4] bg-gray-50 p-4 rounded-lg shadow-sm h-[48rem] flex flex-col">
              <h3 className="text-lg font-medium mb-2 text-center text-black">
                Polygon Chart
              </h3>
              <div className="flex-1 overflow-hidden">
                {/* Pass the shared timestamp to the Polygon Chart */}
                <EEGPolygonChart displayAtSec={sharedTimestamp} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
