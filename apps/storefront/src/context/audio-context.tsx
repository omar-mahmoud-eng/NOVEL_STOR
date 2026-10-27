"use client"

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react"

export type AudioTrack = {
  id: string
  title: string
  author?: string
  narrator?: string
  coverUrl?: string
  audioUrl: string
  durationSeconds?: number
}

type AudioContextType = {
  currentTrack: AudioTrack | null
  isPlaying: boolean
  currentTime: number
  duration: number
  playbackRate: number
  sleepTimer: number | null
  playTrack: (track: AudioTrack) => void
  togglePlayPause: () => void
  seek: (seconds: number) => void
  setSpeed: (rate: number) => void
  setTimer: (minutes: number | null) => void
  closePlayer: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [sleepTimer, setSleepTimer] = useState<number | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()

      const audio = audioRef.current

      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime)
      })

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration || 0)
      })

      audio.addEventListener("ended", () => {
        setIsPlaying(false)
        setCurrentTime(0)
      })

      audio.addEventListener("pause", () => setIsPlaying(false))
      audio.addEventListener("play", () => setIsPlaying(true))
    }

    return () => {
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  const playTrack = useCallback((track: AudioTrack) => {
    if (!audioRef.current) return
    setCurrentTrack(track)
    setCurrentTime(0)
    setDuration(0)
    audioRef.current.src = track.audioUrl
    audioRef.current.playbackRate = playbackRate
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.error("Audio playback error:", err))
  }, [playbackRate])

  const togglePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((error) => { setIsPlaying(false); console.error("Audio playback error:", error) })
    }
  }

  const seek = (seconds: number) => {
    if (!audioRef.current || !Number.isFinite(seconds)) return
    const target = Math.max(0, Math.min(seconds, Number.isFinite(audioRef.current.duration) ? audioRef.current.duration : seconds))
    audioRef.current.currentTime = target
    setCurrentTime(target)
  }

  const setSpeed = (rate: number) => {
    if (!Number.isFinite(rate) || rate < 0.25 || rate > 4) return
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }

  const setTimer = (minutes: number | null) => {
    setSleepTimer(minutes)
    if (timerTimeoutRef.current) {
      clearTimeout(timerTimeoutRef.current)
    }

    if (minutes && minutes > 0) {
      timerTimeoutRef.current = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause()
          setIsPlaying(false)
          setSleepTimer(null)
        }
      }, minutes * 60 * 1000)
    }
  }

  const closePlayer = () => {
    if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current)
    setSleepTimer(null)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
    }
    setCurrentTrack(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        playbackRate,
        sleepTimer,
        playTrack,
        togglePlayPause,
        seek,
        setSpeed,
        setTimer,
        closePlayer,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}
