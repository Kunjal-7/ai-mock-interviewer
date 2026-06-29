"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { InterviewAnswer, InterviewConfig, GeneratedQuestion } from "@/app/page"
import { Bot, ChevronRight, Mic, MicOff, Phone, User, Video, VideoOff, Clock, AlertCircle, PlayCircle, PauseCircle } from "lucide-react"

interface InterviewViewProps {
  config: InterviewConfig
  questions: GeneratedQuestion[]
  onEnd: (answers: InterviewAnswer[]) => void
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
  onstart: () => void
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export default function InterviewView({ config, questions, onEnd }: InterviewViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [timeLeft, setTimeLeft] = useState(questions[0]?.estimatedTime || 120)

  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [finalTranscript, setFinalTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [answers, setAnswers] = useState<InterviewAnswer[]>([])

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        })
        setCameraStream(stream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error("Camera error:", err)
        setCameraError("Camera access denied. You can still continue without video.")
      }
    }

    initCamera()

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
    }
  }, [cameraStream, isVideoOn])

  const initSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return null

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser")
      return null
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang =
      config.language === "hindi"
        ? "hi-IN"
        : config.language === "spanish"
          ? "es-ES"
          : config.language === "german"
            ? "de-DE"
            : config.language === "french"
              ? "fr-FR"
              : "en-US"

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimText = ""
      let finalText = ""

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript

        if (result.isFinal) {
          finalText += transcript + " "
        } else {
          interimText += transcript
        }
      }

      if (finalText) {
        setFinalTranscript(finalText)
      }

      setInterimTranscript(interimText)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== "aborted" && event.error !== "no-speech") {
        console.error("Speech recognition error:", event.error)
      }
      if (event.error !== "aborted" && event.error !== "no-speech") {
        setIsListening(false)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      if (isMicOn && !isSpeaking) {
        try {
          recognition.start()
        } catch (e) {
          // Already started
        }
      }
    }

    return recognition
  }, [isMicOn, isSpeaking, config.language])

  const speakText = useCallback((text: string, onComplete?: () => void) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.warn("Speech Synthesis not supported")
      onComplete?.()
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => {
      setIsSpeaking(true)
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Not started
        }
      }
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      onComplete?.()
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
      onComplete?.()
    }

    synthRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = initSpeechRecognition()
    }
    if (recognitionRef.current && !isListening && !isSpeaking) {
      try {
        recognitionRef.current.start()
      } catch (e) {
        // Already started
      }
    }
  }, [initSpeechRecognition, isListening, isSpeaking])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        // Not started
      }
    }
    setIsListening(false)
  }, [])

  useEffect(() => {
    if (questions.length === 0) return

    const timer = setTimeout(() => {
      speakText(questions[0].question, () => {
        startListening()
      })
    }, 500)

    return () => {
      clearTimeout(timer)
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    if (questions.length === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion()
          return questions[currentQuestion]?.estimatedTime || 120
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [currentQuestion, questions.length])

  const handleMicToggle = () => {
    if (isMicOn) {
      stopListening()
    } else {
      startListening()
    }
    setIsMicOn(!isMicOn)
  }

  const handleVideoToggle = () => {
    if (cameraStream) {
      cameraStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn
      })
    }
    setIsVideoOn(!isVideoOn)
  }

  const handleNextQuestion = () => {
    stopListening()

    const fullTranscript = (finalTranscript + interimTranscript).trim()

    const newAnswer: InterviewAnswer = {
      question: questions[currentQuestion].question,
      userAnswer: fullTranscript,
    }

    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)

    setFinalTranscript("")
    setInterimTranscript("")

    if (currentQuestion >= questions.length - 1) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
      onEnd(updatedAnswers)
    } else {
      const nextIndex = currentQuestion + 1
      setCurrentQuestion(nextIndex)
      setTimeLeft(questions[nextIndex]?.estimatedTime || 120)

      speakText(questions[nextIndex].question, () => {
        if (isMicOn) {
          startListening()
        }
      })
    }
  }

  const handleEndInterview = () => {
    stopListening()
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
    }

    const fullTranscript = (finalTranscript + interimTranscript).trim()
    const finalAnswers = [...answers]
    if (fullTranscript) {
      finalAnswers.push({
        question: questions[currentQuestion].question,
        userAnswer: fullTranscript,
      })
    }

    onEnd(finalAnswers)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-zinc-300">
        <p className="text-zinc-500 animate-pulse">Loading questions...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-black font-sans text-zinc-300 selection:bg-purple-300 selection:text-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/80 backdrop-blur-md px-6 py-4 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-300 flex items-center justify-center text-black shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white block">AI Session</span>
                <span className="text-xs text-zinc-500 font-mono">LIVE INTERVIEW</span>
              </div>
            </div>
            <div className="h-8 w-px bg-zinc-800 mx-2 hidden sm:block"></div>
            <Badge variant="secondary" className="bg-zinc-900 text-zinc-300 border-zinc-800 hidden sm:flex">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
              <Clock className="w-4 h-4 text-emerald-300" />
              <span className={`font-mono font-bold ${timeLeft <= 30 ? "text-red-400" : "text-white"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <Badge
              variant={isListening ? "default" : "secondary"}
              className={`capitalize px-3 py-1.5 rounded-full border-0 ${
                isSpeaking
                  ? "bg-purple-300 text-black font-bold animate-pulse"
                  : isListening
                    ? "bg-blue-300 text-black font-bold"
                    : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {isSpeaking ? (
                <span className="flex items-center gap-2"><PlayCircle className="w-3 h-3"/> Speaking</span>
              ) : isListening ? (
                <span className="flex items-center gap-2"><Mic className="w-3 h-3"/> Listening</span>
              ) : (
                <span className="flex items-center gap-2"><PauseCircle className="w-3 h-3"/> Paused</span>
              )}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 p-6 pt-24 pb-24">
        <div className="max-w-6xl mx-auto h-full flex flex-col gap-6">
          {/* Video Grid */}
          <div className="flex-1 grid md:grid-cols-3 gap-6">
            
            {/* AI Interviewer - Large */}
            <div className="md:col-span-2 relative rounded-[2rem] bg-zinc-900 border border-zinc-800 overflow-hidden min-h-[400px] shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className={`w-40 h-40 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isSpeaking ? 'bg-purple-300 border-purple-300/20 shadow-[0_0_60px_rgba(216,180,254,0.3)]' : 'bg-zinc-800 border-zinc-700'}`}>
                    <Bot className={`w-20 h-20 ${isSpeaking ? 'text-black' : 'text-zinc-500'}`} />
                  </div>
                  
                  {isSpeaking && (
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-end gap-1.5 h-10">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 bg-purple-300 rounded-full animate-bounce"
                          style={{
                            height: `${Math.random() * 24 + 10}px`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: "0.6s",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-300"></div>
                  AI Interviewer
                </span>
              </div>
            </div>

            {/* User Camera */}
            <div className="relative rounded-[2rem] bg-zinc-900 border border-zinc-800 overflow-hidden aspect-video md:aspect-auto min-h-[250px] shadow-xl">
              {cameraStream && isVideoOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                      <User className="w-10 h-10" />
                    </div>
                    {isListening && isMicOn && (
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                        <div className="flex gap-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-0"></div>
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-100"></div>
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-200"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {cameraError && !cameraStream && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                    <p className="text-sm text-zinc-400">{cameraError}</p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-blue-400' : 'bg-zinc-500'}`}></div>
                  You
                </span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <Card className="p-8 bg-zinc-900 border-zinc-800 rounded-[2rem] shadow-lg">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-2xl bg-pink-300 flex items-center justify-center flex-shrink-0 text-black shadow-lg shadow-pink-900/20">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Current Question</h3>
                <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">{questions[currentQuestion].question}</p>
              </div>
            </div>
          </Card>

          {/* Transcript Card */}
          <Card className="p-6 bg-black border-zinc-800 rounded-[2rem]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 text-zinc-400 border border-zinc-700">
                <Mic className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-bold text-zinc-400">Live Transcript</h3>
                  {isListening && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                      Recording...
                    </span>
                  )}
                </div>
                <p className="text-zinc-300 text-lg leading-relaxed ">
                  {finalTranscript || interimTranscript ? (
                    <>
                      {finalTranscript}
                      {interimTranscript && <span className="text-zinc-500">{interimTranscript}</span>}
                    </>
                  ) : (
                    <span className="text-zinc-600 italic">
                      {isSpeaking
                        ? "Waiting for AI to finish speaking..."
                        : "Start speaking to see your response here..."}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer Controls */}
      <div className="bottom-0 left-0 right-0 p-6 bg-black/90 backdrop-blur-xl border-t border-zinc-800 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-6">
          <Button
            variant="ghost"
            size="lg"
            className={`h-16 w-16 rounded-full border-2 transition-all duration-300 ${
              isMicOn 
                ? "border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700" 
                : "border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20"
            }`}
            onClick={handleMicToggle}
          >
            {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className={`h-16 w-16 rounded-full border-2 transition-all duration-300 ${
              isVideoOn 
                ? "border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700" 
                : "border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20"
            }`}
            onClick={handleVideoToggle}
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          <Button 
            size="lg" 
            className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 text-white border-4 border-black ring-2 ring-red-500/30" 
            onClick={handleEndInterview}
          >
            <Phone className="w-6 h-6 rotate-[135deg]" />
          </Button>

          <div className="w-px h-10 bg-zinc-800 mx-2" />

          <Button
            onClick={handleNextQuestion}
            className="h-14 px-12 rounded-full bg-blue-300 hover:bg-blue-200 text-black font-bold text-lg flex items-center gap-2 shadow-lg shadow-blue-900/20"
          >
            {currentQuestion >= questions.length - 1 ? "Finish" : "Next"}
            <ChevronRight className="w-5 h-5 mx-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}