// src/app/flow/charts/page.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import { EEGChart } from "@/components/EEGChart";
import { EEGPolygonChart } from "@/components/EEGPolygonChart";

export default function ChartsPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const miniRef = useRef<HTMLVideoElement>(null);

  // PIP window dragging state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Mini-window visibility
  const [showMini, setShowMini] = useState(false);

  // Track current playback time and play state of the main video
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize PIP position on mount
  useEffect(() => {
    const miniW = 400,
      miniH = 225,
      margin = 20;
    setPos({
      x: window.innerWidth - miniW - margin,
      y: window.innerHeight - miniH - margin,
    });
  }, []);

  // Sync mini video to main: time, play, pause
  useEffect(() => {
    const main = videoRef.current;
    const mini = miniRef.current;
    if (!main || !mini) return;

    const syncTime = () => {
      mini.currentTime = main.currentTime;
    };
    const syncPlay = () => {
      if (showMini) mini.play();
    };
    const syncPause = () => {
      mini.pause();
    };

    main.addEventListener("timeupdate", syncTime);
    main.addEventListener("play", syncPlay);
    main.addEventListener("pause", syncPause);

    return () => {
      main.removeEventListener("timeupdate", syncTime);
      main.removeEventListener("play", syncPlay);
      main.removeEventListener("pause", syncPause);
    };
  }, [showMini]);

  // When PIP appears, if main is playing start mini; otherwise keep it paused
  useEffect(() => {
    const main = videoRef.current;
    const mini = miniRef.current;
    if (showMini && main && mini) {
      if (!main.paused) mini.play();
      else mini.pause();
    }
  }, [showMini]);

  // Observe visibility of main video to toggle PIP
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowMini(entry.intersectionRatio < 0.8),
      { threshold: [0, 0.8, 1] }
    );
    observer.observe(vid);
    return () => observer.disconnect();
  }, []);

  // Update currentTime on main video progress
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current?.currentTime ?? 0);
  };

  // Track play/pause state via native controls
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    vid.addEventListener("play", onPlay);
    vid.addEventListener("pause", onPause);
    return () => {
      vid.removeEventListener("play", onPlay);
      vid.removeEventListener("pause", onPause);
    };
  }, []);

  // Custom play/pause triggered by chart button
  const handlePlayPause = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) vid.play();
    else vid.pause();
  };

  // Drag handlers for PIP
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };
    const onUp = () => setDragging(false);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  // Seek & pause when a chart timestamp is clicked
  const handlePointClick = (sec: number) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = sec;
    vid.pause();
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
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* EEG Visualizations */}
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-black">
            EEG Visualizations
          </h2>
          <div className="w-full flex gap-6 justify-center transform scale-80 origin-top">
            {/* Line Plot */}
            <div className="flex-[6] bg-gray-50 p-4 rounded-lg shadow-sm h-[48rem] flex flex-col">
              <h3 className="text-lg font-medium mb-2 text-center text-black">
                Line Plot
              </h3>
              <div className="flex-1">
                <EEGChart
                  onPointClick={handlePointClick}
                  revealUpTo={currentTime}
                  onPlayPause={handlePlayPause}
                  isPlaying={isPlaying}
                />
              </div>
            </div>

            {/* Polygon Chart */}
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

      {/* bottom spacer */}
      <div className="h-20" />

      {/* Draggable mini video mirror */}
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
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
