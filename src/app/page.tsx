// src/app/page.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import { EEGChart } from "../components/EEGChart";
import { EEGPolygonChart } from "../components/EEGPolygonChart";
import { HistoryPanel } from "../components/HistoryPanel";

export default function ChartsPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const miniRef = useRef<HTMLVideoElement>(null);

  // PIP dragging state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // show mini-player?
  const [showMini, setShowMini] = useState(false);

  // video playback time for chart reveal
  const [currentTime, setCurrentTime] = useState(0);

  // track play/pause state for overlay button
  const [isPlaying, setIsPlaying] = useState(false);

  // Jump-to input state
  const [jumpSec, setJumpSec] = useState(0);

  // initialize PIP position on mount
  useEffect(() => {
    const miniW = 400,
      miniH = 225,
      margin = 20;
    setPos({
      x: window.innerWidth - miniW - margin,
      y: window.innerHeight - miniH - margin,
    });
  }, []);

  // sync mini with main video (time / play / pause)
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

  // toggle PIP when main video scrolls out
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const obs = new IntersectionObserver(
      ([e]) => setShowMini(e.intersectionRatio < 0.8),
      { threshold: [0, 0.8, 1] }
    );
    obs.observe(vid);
    return () => obs.disconnect();
  }, []);

  // update currentTime for EEGChart.revealUpTo
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current?.currentTime ?? 0);
  };

  // track native play/pause
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

  // seek & pause when EEGChart point clicked or Jump-to Go pressed
  const handlePointClick = (sec: number) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = sec;
    vid.pause();
  };

  // play/pause toggle for overlay button
  const handlePlayPause = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
    } else {
      vid.pause();
    }
  };

  // PIP drag handlers
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

  return (
    <div className="w-full min-h-screen bg-white px-4 py-6">
      <div className="max-w-screen-2xl mx-auto space-y-8">
        {/* History panel unchanged */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-black">History</h2>
          <HistoryPanel />
        </section>

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

              {/* Jump-to input feature */}
              <div className="flex items-center mb-4">
                <label className="text-black mr-2">Jump to (s):</label>
                <input
                  type="number"
                  min={0}
                  value={jumpSec}
                  onChange={(e) => setJumpSec(Number(e.target.value))}
                  className="border p-1 w-20 text-black mr-2"
                />
                <button
                  onClick={() => handlePointClick(jumpSec)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Go
                </button>
              </div>

              {/* Chart with Play/Pause overlay */}
              <div className="relative flex-1 transform scale-90 origin-center">
                <button
                  onClick={handlePlayPause}
                  className="absolute top-2 left-2 bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full shadow z-10"
                >
                  {isPlaying ? "⏸️" : "▶️"}
                </button>
                <EEGChart
                  onPointClick={handlePointClick}
                  revealUpTo={currentTime}
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
