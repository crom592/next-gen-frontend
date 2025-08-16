'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  title: string
  watermarkText?: string
  className?: string
  onError?: (error: string) => void
}

export default function VideoPlayer({ 
  src, 
  title, 
  watermarkText, 
  className = '',
  onError 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    
    const handleError = () => {
      const errorMessage = 'Failed to load video'
      setError(errorMessage)
      setLoading(false)
      onError?.(errorMessage)
    }

    const handleVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('error', handleError)
    video.addEventListener('volumechange', handleVolumeChange)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('error', handleError)
      video.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [onError])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const time = parseFloat(e.target.value)
    video.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      container.requestFullscreen()
    }
  }

  const resetControls = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-video flex items-center justify-center">
          <div className="text-center text-white">
            <RotateCcw className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <p className="text-lg mb-2">동영상을 불러올 수 없습니다</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseMove={resetControls}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        if (isPlaying) {
          controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 1000)
        }
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full aspect-video"
        onClick={togglePlay}
        preload="metadata"
      />

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Watermark */}
      {watermarkText && (
        <div className="absolute bottom-4 right-4 text-white text-sm opacity-70 bg-black bg-opacity-50 px-2 py-1 rounded">
          {watermarkText}
        </div>
      )}

      {/* NEXT GEN Brand Watermark */}
      <div className="absolute bottom-4 left-4 text-white text-lg font-bold opacity-70">
        NEXT GEN
      </div>

      {/* Play/Pause Overlay */}
      {!loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={togglePlay}
            className={`p-4 rounded-full bg-black bg-opacity-50 text-white transition-opacity pointer-events-auto ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8" />
            )}
          </button>
        </div>
      )}

      {/* Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 transition-opacity ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="hover:text-blue-400 transition-colors">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="hover:text-blue-400 transition-colors">
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">{title}</span>
            <button 
              onClick={toggleFullscreen}
              className="hover:text-blue-400 transition-colors"
            >
              <Maximize className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}