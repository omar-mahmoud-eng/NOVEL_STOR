"use client"

import React from "react"
import Image from "next/image"
import { useAudio } from "@/context/audio-context"
import {
  Play,
  Pause,
  X,
  Volume2,
  Clock,
  RotateCcw,
  FastForward,
  Headphones,
} from "lucide-react"

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "00:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export function FloatingAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    sleepTimer,
    togglePlayPause,
    seek,
    setSpeed,
    setTimer,
    closePlayer,
  } = useAudio()

  if (!currentTrack) return null

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    seek(val)
  }

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2]
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length
    setSpeed(speeds[nextIdx])
  }

  const cycleTimer = () => {
    const timers = [null, 15, 30, 45]
    const nextIdx = (timers.indexOf(sleepTimer) + 1) % timers.length
    setTimer(timers[nextIdx])
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-2 sm:p-4 pointer-events-none animate-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-3 sm:p-4 pointer-events-auto flex flex-col gap-2">
        {/* Progress Bar Header */}
        <div className="w-full flex items-center gap-2">
          <span className="text-[11px] font-mono text-muted-foreground w-10 text-end">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSliderChange}
            className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="text-[11px] font-mono text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
        </div>

        {/* Player Controls Bar */}
        <div className="flex items-center justify-between gap-3">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
              {currentTrack.coverUrl ? (
                <Image
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary">
                  <Headphones className="w-6 h-6" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                {currentTrack.title}
              </h4>
              <p className="text-[11px] text-muted-foreground truncate">
                {currentTrack.narrator
                  ? `بصوت: ${currentTrack.narrator}`
                  : currentTrack.author || "عينة صوتية مجانية"}
              </p>
            </div>
          </div>

          {/* Core Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Speed Toggle */}
            <button
              onClick={cycleSpeed}
              className="px-2 py-1 rounded-md bg-muted text-[11px] font-bold text-foreground hover:bg-muted/80 transition-colors"
              title="سرعة التشغيل / Playback Speed"
            >
              {playbackRate}x
            </button>

            {/* Sleep Timer */}
            <button
              onClick={cycleTimer}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                sleepTimer
                  ? "bg-primary text-primary-foreground font-bold"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              title="مؤقت النوم / Sleep Timer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{sleepTimer ? `${sleepTimer}m` : "مؤقت"}</span>
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-transform active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Close */}
            <button
              onClick={closePlayer}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="إغلاق المشغل"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
