"use client"

import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import type { VideoSectionData } from "@/types/home-types"
import { useState, useRef, useEffect } from "react"
import SectionTitle from "@/components/ui/section-title"
import { motion } from "framer-motion"

interface VideoSectionProps {
  data: VideoSectionData
}

export default function VideoSection({ data }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        // Add a promise to handle the play attempt
        const playPromise = videoRef.current.play();
        
        // Play attempts might be rejected due to browser policies
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
            })
            .catch(error => {
              console.error("Error playing video:", error)
              // Keep isPlaying as false since play failed
            });
        }
        return; // Let the promise handle the state update
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const newTime = clickPosition * videoRef.current.duration;
      
      videoRef.current.currentTime = newTime;
      setProgress(clickPosition * 100);
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault(); // Prevent page scrolling
      togglePlay();
    }
  };

  // Format time as MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const updateProgress = () => {
      if (videoRef.current) {
        const value = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(value);
        setCurrentTime(videoRef.current.currentTime);
      }
    }

    const handleMetadataLoaded = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
        setIsLoaded(true);
      }
    };

    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.addEventListener("timeupdate", updateProgress)
      videoElement.addEventListener("loadedmetadata", handleMetadataLoaded)
      videoElement.addEventListener("pause", () => setIsPlaying(false))
      videoElement.addEventListener("play", () => setIsPlaying(true))
      // Preload the video metadata
      videoElement.preload = "metadata"
    }

    // Add keyboard event listener to document
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", updateProgress)
        videoElement.removeEventListener("loadedmetadata", handleMetadataLoaded)
        videoElement.removeEventListener("pause", () => setIsPlaying(false))
        videoElement.removeEventListener("play", () => setIsPlaying(true))
      }
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  return (
    <section id={data.section_id} className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <SectionTitle title={data.title} highlight={data.subtitle} light={true} />

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
            <div 
              className="absolute inset-0 flex items-center justify-center"
              onClick={togglePlay}
            >
              <video
                ref={videoRef}
                src={data.video_url}
                className="max-w-full max-h-full object-contain" 
                poster={data.back_ground_image || "/placeholder.svg?height=800&width=1600"}
                playsInline
                preload="metadata"
                onError={(e) => console.error("Video error:", e)}
              />
            </div>

            {/* Video controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress bar and time */}
              <div className="flex items-center mb-2">
                <span className="text-xs text-white/70 mr-2">{formatTime(currentTime)}</span>
                <div 
                  ref={progressBarRef}
                  className="flex-grow h-1 bg-white/20 rounded-full cursor-pointer"
                  onClick={handleProgressBarClick}
                >
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="text-xs text-white/70 ml-2">{formatTime(duration)}</span>
              </div>

              <div className="flex justify-between items-center">
                <button onClick={togglePlay} className="bg-white/10 hover:bg-white/20 p-2 rounded-full">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>

                <button onClick={toggleMute} className="bg-white/10 hover:bg-white/20 p-2 rounded-full">
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Play button overlay when video is paused */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer" 
                onClick={togglePlay}
              >
                <div className="h-16 w-16 rounded-full bg-red-500/90 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <span className="absolute bottom-6 text-white font-medium">{data.watch_text}</span>
              </div>
            )}
          </div>
        </motion.div>

        {data.list_items && data.list_items.length > 0 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.list_items.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center bg-white/10 backdrop-blur-sm p-3 rounded-md"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="h-6 w-6 rounded-md bg-red-500 flex items-center justify-center text-white mr-3">
                    {index + 1}
                  </div>
                  <span className="text-white/90">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
