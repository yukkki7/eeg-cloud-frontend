// src/app/flow/charts/page.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import { EEGChart } from "@/components/EEGChart";
import { EEGPolygonChart } from "@/components/EEGPolygonChart";

export default function ChartsPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const miniRef = useRef<HTMLVideoElement>(null);

  // dragging state for mini-window
  const [pos, setPos] = useState({
    x: window.innerWidth - 180,
    y: window.innerHeight - 140,
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // control mini-window visibility
  const [showMini, setShowMini] = useState(false);

  // sync mini video time to main video
  useEffect(() => {
    const main = videoRef.current;
    const mini = miniRef.current;
    if (!main || !mini) return;
    const handler = () => {
      mini.currentTime = main.currentTime;
    };
    main.addEventListener("timeupdate", handler);
    return () => {
      main.removeEventListener("timeupdate", handler);
    };
  }, []);

  // observe how much of the main video is visible
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // if less than 80% visible, show mini-window
        setShowMini(entry.intersectionRatio < 0.8);
      },
      { threshold: [0, 0.8, 1] }
    );

    observer.observe(vid);
    return () => {
      observer.disconnect();
    };
  }, []);

  // dragging logic
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };
    const onMouseUp = () => setDragging(false);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  // click on chart to seek video
  const handlePointClick = (sec: number) => {
    const vid = videoRef.current;
    if (!vid) return;
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
          <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-inner mx-auto">
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
            <div className="flex-[6] bg-gray-50 p-4 rounded-lg shadow-sm h-[44rem] flex flex-col">
              <h3 className="text-lg font-medium mb-2 text-center text-black">
                Line Plot
              </h3>
              <div className="flex-1">
                <EEGChart onPointClick={handlePointClick} />
              </div>
            </div>
            <div className="flex-[4] bg-gray-50 p-4 rounded-lg shadow-sm h-[48rem] flex flex-col">
              <h3 className="text-lg font-medium mb-2 text-center text-black">
                Polygon Chart
              </h3>
              <div className="flex-1 overflow-hidden">
                <EEGPolygonChart />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom spacer */}
      <div className="h-20" />

      {/* Draggable mini video: only render when main video is <80% visible */}
      {showMini && (
        <div
          onMouseDown={onMouseDown}
          style={{
            position: "fixed",
            top: pos.y,
            left: pos.x,
            width: 400,
            height: 225,
            cursor: dragging ? "grabbing" : "grab",
            zIndex: 50,
          }}
          className="bg-black rounded-lg overflow-hidden shadow-lg ring-2 ring-white"
        >
          <video
            ref={miniRef}
            src="/test_video.mp4"
            muted
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
