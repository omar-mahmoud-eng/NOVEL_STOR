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
  Sparkles,
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
      <div className="stitch-glass max-w-4xl mx-auto rounded-3xl shadow-2xl p-3 sm:p-4 pointer-events-auto flex flex-col gap-2.5 border border-amber-500/30">
        {/* Progress Bar Header */}
        <div className="w-full flex items-center gap-2.5">
          <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 w-11 text-end">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-muted/60 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:h-2 transition-all"
            />
          </div>
          <span className="text-[11px] font-mono text-muted-foreground w-11">
            {formatTime(duration)}
          </span>
        </div>

        {/* Player Controls Bar */}
        <div className="flex items-center justify-between gap-3">
          {/* Track Info with 3D Thumbnail & Animated Waveform */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="stitch-book-3d relative w-12 h-14 rounded-xl overflow-hidden bg-muted/40 border border-amber-500/30 shrink-0 shadow-md">
              {currentTrack.coverUrl ? (
                <Image
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-500">
                  <Headphones className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs sm:text-sm font-black text-foreground truncate">
                  {currentTrack.title}
                </h4>
                {isPlaying && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    <span className="w-0.5 h-3 bg-amber-500 rounded-full stitch-bar-1" />
                    <span className="w-0.5 h-4 bg-amber-500 rounded-full stitch-bar-2" />
                    <span className="w-0.5 h-2.5 bg-amber-500 rounded-full stitch-bar-3" />
                  </div>
                )}
              </div>
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
              className="px-2.5 py-1 rounded-xl bg-card border border-border/80 text-[11px] font-bold text-foreground hover:border-amber-500/40 hover:text-amber-500 transition-colors shadow-2xs"
              title="سرعة التشغيل / Playback Speed"
            >
              {playbackRate}x
            </button>

            {/* Sleep Timer */}
            <button
              onClick={cycleTimer}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors shadow-2xs ${
                sleepTimer
                  ? "stitch-gold-gradient text-white border-transparent"
                  : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
              }`}
              title="مؤقت النوم / Sleep Timer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{sleepTimer ? `${sleepTimer}m` : "مؤقت"}</span>
            </button>

            {/* Play/Pause Button with Gold Gradient */}
            <button
              onClick={togglePlayPause}
              className="stitch-gold-gradient w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 border border-white/20"
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
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
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
