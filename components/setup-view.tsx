"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { InterviewConfig, GeneratedQuestion, ViewType } from "@/app/page"
import { generateInterviewQuestions } from "@/app/actions/gemini"
import { extractTextFromPDF } from "@/app/actions/pdf"
import Navbar from "@/components/navbar"
import { ArrowLeft, Bot, FileText, Loader2, Upload, X, Settings2 } from "lucide-react"

interface SetupViewProps {
  config: InterviewConfig
  setConfig: (config: InterviewConfig) => void
  onGenerate: (questions: GeneratedQuestion[]) => void
  onBack: () => void
  navigateTo: (view: ViewType) => void
}

export default function SetupView({ config, setConfig, onGenerate, onBack, navigateTo }: SetupViewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isParsing, setIsParsing] = useState(false)

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const questions = await generateInterviewQuestions(config)
      onGenerate(questions)
    } catch (error) {
      console.error("Failed to generate questions:", error)
      onGenerate([
        { question: `Tell me about your experience with ${config.techStack}.`, estimatedTime: 120 },
        { question: `How would you design a scalable system for ${config.company}?`, estimatedTime: 180 },
        { question: `Describe a challenging bug you've debugged.`, estimatedTime: 120 },
        { question: `What's your approach to code reviews?`, estimatedTime: 90 },
        { question: `Where do you see yourself in 5 years?`, estimatedTime: 90 },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === "application/pdf") {
      await processFile(file)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  const processFile = async (file: File) => {
    setConfig({ ...config, resumeFile: file.name })
    setIsParsing(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      const text = await extractTextFromPDF(formData)
      setConfig({ ...config, resumeFile: file.name, resumeText: text })
    } catch (error) {
      console.error("Failed to parse PDF:", error)
      setConfig({ ...config, resumeFile: file.name, resumeText: null })
    } finally {
      setIsParsing(false)
    }
  }

  const removeResume = () => {
    setConfig({ ...config, resumeFile: null, resumeText: null })
  }

  return (
    <div className="min-h-screen flex flex-col bg-black font-sans text-zinc-300 selection:bg-purple-300 selection:text-black">
      {/* Use shared Navbar with back functionality */}
      <Navbar navigateTo={navigateTo} showBack onBack={onBack} />

      {/* Form Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <Card className="border-zinc-800 bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="text-center pb-8 pt-10 px-10 border-b border-zinc-800/50 bg-zinc-900/50">
              <div className="mx-auto w-12 h-12 bg-purple-300 rounded-xl flex items-center justify-center mb-4 text-black shadow-lg shadow-purple-900/20">
                <Settings2 className="w-6 h-6" />
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2">Set Up Your Interview</CardTitle>
              <CardDescription className="text-zinc-400 text-base">
                Tell us about your target position and we'll create a personalized interview.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 p-10">
              {/* Row 1: Company & Role */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="company" className="text-zinc-300 font-medium">
                    Target Company
                  </Label>
                  <Input
                    id="company"
                    placeholder="e.g., Google, Meta, Startup"
                    value={config.company}
                    onChange={(e) => setConfig({ ...config, company: e.target.value })}
                    className="h-12 bg-black border-zinc-800 text-white placeholder:text-zinc-600 focus:border-purple-300 focus:ring-purple-300/20 rounded-xl"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="role" className="text-zinc-300 font-medium">
                    Job Role
                  </Label>
                  <Input
                    id="role"
                    placeholder="e.g., Senior Frontend Engineer"
                    value={config.role}
                    onChange={(e) => setConfig({ ...config, role: e.target.value })}
                    className="h-12 bg-black border-zinc-800 text-white placeholder:text-zinc-600 focus:border-purple-300 focus:ring-purple-300/20 rounded-xl"
                  />
                </div>
              </div>

              {/* Row 2: Tech Stack & Language */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="techStack" className="text-zinc-300 font-medium">
                    Tech Stack / Programming Language
                  </Label>
                  <Select
                    value={config.techStack}
                    onValueChange={(value) => setConfig({ ...config, techStack: value })}
                  >
                    <SelectTrigger className="h-12 bg-black border-zinc-800 text-white rounded-xl focus:ring-purple-300/20 focus:border-purple-300">
                      <SelectValue placeholder="Select your primary technology" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="react" className="focus:bg-zinc-800 focus:text-white">React / TypeScript</SelectItem>
                      <SelectItem value="python" className="focus:bg-zinc-800 focus:text-white">Python</SelectItem>
                      <SelectItem value="java" className="focus:bg-zinc-800 focus:text-white">Java</SelectItem>
                      <SelectItem value="go" className="focus:bg-zinc-800 focus:text-white">Go</SelectItem>
                      <SelectItem value="rust" className="focus:bg-zinc-800 focus:text-white">Rust</SelectItem>
                      <SelectItem value="nodejs" className="focus:bg-zinc-800 focus:text-white">Node.js</SelectItem>
                      <SelectItem value="csharp" className="focus:bg-zinc-800 focus:text-white">C# / .NET</SelectItem>
                      <SelectItem value="cpp" className="focus:bg-zinc-800 focus:text-white">C++</SelectItem>
                      <SelectItem value="swift" className="focus:bg-zinc-800 focus:text-white">Swift / iOS</SelectItem>
                      <SelectItem value="kotlin" className="focus:bg-zinc-800 focus:text-white">Kotlin / Android</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="language" className="text-zinc-300 font-medium">
                    Interview Language
                  </Label>
                  <Select value={config.language} onValueChange={(value) => setConfig({ ...config, language: value })}>
                    <SelectTrigger className="h-12 bg-black border-zinc-800 text-white rounded-xl focus:ring-purple-300/20 focus:border-purple-300">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="english" className="focus:bg-zinc-800 focus:text-white">English</SelectItem>
                      <SelectItem value="hindi" className="focus:bg-zinc-800 focus:text-white">Hindi</SelectItem>
                      <SelectItem value="spanish" className="focus:bg-zinc-800 focus:text-white">Spanish</SelectItem>
                      <SelectItem value="german" className="focus:bg-zinc-800 focus:text-white">German</SelectItem>
                      <SelectItem value="french" className="focus:bg-zinc-800 focus:text-white">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Interview Type & Difficulty */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="interviewType" className="text-zinc-300 font-medium">
                    Interview Type
                  </Label>
                  <Select
                    value={config.interviewType}
                    onValueChange={(value) => setConfig({ ...config, interviewType: value })}
                  >
                    <SelectTrigger className="h-12 bg-black border-zinc-800 text-white rounded-xl focus:ring-purple-300/20 focus:border-purple-300">
                      <SelectValue placeholder="Select interview type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="technical" className="focus:bg-zinc-800 focus:text-white">Technical</SelectItem>
                      <SelectItem value="behavioral" className="focus:bg-zinc-800 focus:text-white">Behavioral</SelectItem>
                      <SelectItem value="system-design" className="focus:bg-zinc-800 focus:text-white">System Design</SelectItem>
                      <SelectItem value="mixed" className="focus:bg-zinc-800 focus:text-white">Mixed (All Types)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="difficulty" className="text-zinc-300 font-medium">
                    Difficulty Level
                  </Label>
                  <Select
                    value={config.difficulty}
                    onValueChange={(value) => setConfig({ ...config, difficulty: value })}
                  >
                    <SelectTrigger className="h-12 bg-black border-zinc-800 text-white rounded-xl focus:ring-purple-300/20 focus:border-purple-300">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="beginner" className="focus:bg-zinc-800 focus:text-white">Beginner</SelectItem>
                      <SelectItem value="intermediate" className="focus:bg-zinc-800 focus:text-white">Intermediate</SelectItem>
                      <SelectItem value="advanced" className="focus:bg-zinc-800 focus:text-white">Advanced</SelectItem>
                      <SelectItem value="expert" className="focus:bg-zinc-800 focus:text-white">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Experience Slider */}
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300 font-medium">Years of Experience</Label>
                  <span className="px-3 py-1 rounded-full bg-purple-300/10 border border-purple-300/20 text-purple-300 text-sm font-bold">
                    {config.experience} years
                  </span>
                </div>
                <Slider
                  value={[config.experience]}
                  onValueChange={(value) => setConfig({ ...config, experience: value[0] })}
                  min={0}
                  max={15}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-zinc-500 font-medium uppercase tracking-wide">
                  <span>Entry Level</span>
                  <span>Mid-Level</span>
                  <span>Senior</span>
                  <span>Staff+</span>
                </div>
              </div>

              {/* Resume Upload */}
              <div className="space-y-3">
                <Label className="text-zinc-300 font-medium">Resume Upload (Optional)</Label>
                {config.resumeFile ? (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black border border-zinc-800">
                    <div className="w-10 h-10 rounded-lg bg-emerald-300/10 flex items-center justify-center text-emerald-300 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{config.resumeFile}</p>
                      <p className="text-xs text-zinc-500">
                        {isParsing
                          ? "Parsing..."
                          : config.resumeText
                            ? "Resume parsed successfully"
                            : "Ready for interview"}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={removeResume} className="shrink-0 hover:bg-zinc-900 text-zinc-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                      relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group
                      ${isDragging ? "border-purple-300 bg-purple-300/5" : "border-zinc-800 bg-black hover:border-purple-300/50 hover:bg-zinc-900/50"}
                    `}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-zinc-300 mb-1 font-medium">
                      Drag and drop your resume here, or click to browse
                    </p>
                    <p className="text-xs text-zinc-500">PDF files only, up to 5MB</p>
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !config.company || !config.role || !config.techStack}
                className="w-full h-14 text-lg gap-2 bg-purple-300 hover:bg-purple-200 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Interview Questions...
                  </>
                ) : (
                  "Generate Interview"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}