"use client"

import Image from "next/image"
import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { DynamicIcon } from "@/utils/icon-utils"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { HeroData } from "@/types/home-types"

gsap.registerPlugin(ScrollTrigger)

interface HeroSectionProps {
  data: HeroData
}

export default function HeroSection({ data }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  
  // Video player states
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  const smoothY = useSpring(y, { damping: 15, stiffness: 100 })
  const smoothOpacity = useSpring(opacity, { damping: 15, stiffness: 100 })
  const smoothScale = useSpring(scale, { damping: 15, stiffness: 100 })

  // Video control functions
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
            })
            .catch(error => {
              console.error("Error playing video:", error)
            });
        }
        return;
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

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    togglePlay();
    e.stopPropagation(); // Prevent the modal from closing
  }

  const handleVideoKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    }
  }

  useEffect(() => {
    if (!sectionRef.current || !imageRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    })

    tl.to(imageRef.current, {
      scale: 1.2,
      ease: "none",
    })

    return () => {
      tl.kill()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.coaching_steps.length)
    }, 8000) // Slowed down to 8 seconds for better readability

    return () => clearInterval(interval)
  }, [data.coaching_steps.length])

  useEffect(() => {
    // Reset video player state when modal is closed
    if (!isVideoPlaying) {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
      }
    }
  }, [isVideoPlaying]);

  useEffect(() => {
    // Set up video event listeners when modal is open
    if (isVideoPlaying && videoRef.current) {
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
        }
      };

      const videoElement = videoRef.current;
      videoElement.addEventListener("timeupdate", updateProgress);
      videoElement.addEventListener("loadedmetadata", handleMetadataLoaded);
      videoElement.addEventListener("pause", () => setIsPlaying(false));
      videoElement.addEventListener("play", () => setIsPlaying(true));
      
      // Start playing automatically when modal opens
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Error autoplaying video:", error);
          });
      }

      return () => {
        videoElement.removeEventListener("timeupdate", updateProgress);
        videoElement.removeEventListener("loadedmetadata", handleMetadataLoaded);
        videoElement.removeEventListener("pause", () => setIsPlaying(false));
        videoElement.removeEventListener("play", () => setIsPlaying(true));
      }
    }
  }, [isVideoPlaying]);

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen overflow-hidden bg-dark">
      {/* Background Image with Overlay */}
      <div ref={imageRef} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/60 to-dark/80 z-10"></div>

        <Image
          src={
            data.background_image?.startsWith("http")
              ? data.background_image
              : data.background_image?.startsWith("/")
                ? data.background_image
                : `/${data.background_image}` || "/placeholder.svg?height=1080&width=1920"
          }
          alt="HolyFit Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Content */}
      <motion.div
        ref={contentRef}
        style={{ y: smoothY, opacity: smoothOpacity, scale: smoothScale }}
        className="relative z-20 container mx-auto px-4 py-32 md:py-40 flex flex-col items-center min-h-screen"
      >
        {/* Hero content - centered for better focus */}
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <span className="inline-block text-sm md:text-base font-medium mb-4 bg-primary/20 px-6 py-2 rounded-md text-primary">
              {data.welcome_title}
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight font-heading mb-6">
              {data.main_heading}
            </h1>

            <motion.p
              className="text-xl md:text-2xl font-bold text-primary mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {data.highlighted_text}
            </motion.p>

            <motion.div
              className="max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <p className="text-white/90 text-lg md:text-xl mb-4">{data.about_us_text}</p>
              <p className="text-white/90 text-lg md:text-xl">{data.our_expertise_text}</p>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <button
                className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 transition-all font-medium"
                onClick={() => {
                  document.getElementById("our-pricing")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Get Started
              </button>

              <button
                className="bg-white/10 text-white border border-white/30 hover:bg-white/20 px-8 py-3 rounded-md backdrop-blur-sm flex items-center"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="h-4 w-4 mr-2" />
                <span>Watch Demo</span>
              </button>
            </motion.div>

            {/* Fitness journey steps - moved below CTA buttons, no title, no card border */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mt-8">
              {data.coaching_steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-3 rounded-md backdrop-blur-sm transition-all duration-500 text-left ${
                    index === activeIndex ? "bg-white/10 scale-105" : "bg-white/5"
                  }`}
                >
                  <div className="rounded-md bg-primary/20 p-2 flex-shrink-0">
                    <DynamicIcon
                      iconName={typeof step.icon === "string" ? step.icon : "Dumbbell"}
                      className="h-5 w-5 text-primary"
                    />
                  </div>
                  <div>
                    <p className="text-white/90 text-sm text-left">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Custom Video Player Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            className="fixed inset-0 bg-dark/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl aspect-video"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              tabIndex={0}
              onKeyDown={handleVideoKeyDown}
            >
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/50 to-secondary/50 rounded-lg blur-sm"></div>
              <div className="absolute inset-0 rounded-lg overflow-hidden bg-black">
                <div 
                  className="relative w-full h-full flex items-center justify-center"
                  onClick={handleVideoClick}
                >
                  <video
                    ref={videoRef}
                    src={data.intro_video_url}
                    className="max-w-full max-h-full object-contain"
                    playsInline
                    preload="metadata"
                    onError={(e) => console.error("Video error:", e)}
                  />
                  
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
                      onClick={handleVideoClick}
                    >
                      <div className="h-16 w-16 rounded-full bg-red-500/90 flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full z-10"
                onClick={() => setIsVideoPlaying(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
