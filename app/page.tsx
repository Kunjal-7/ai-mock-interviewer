"use client"

import { useState } from "react"
import LandingView from "@/components/landing-view"
import SetupView from "@/components/setup-view"
import InterviewView from "@/components/interview-view"
import ResultsView from "@/components/results-view"
import FAQPage from "@/components/faq-page"
import TeamPage from "@/components/team-page"
import ContactPage from "@/components/contact-page"

export type ViewType = "landing" | "setup" | "interview" | "results" | "faq" | "team" | "contact"

export interface InterviewConfig {
  company: string
  role: string
  techStack: string
  experience: number
  resumeFile: string | null
  resumeText: string | null
  interviewType: string
  difficulty: string
  language: string
}

export interface InterviewAnswer {
  question: string
  userAnswer: string
}

export interface GeneratedQuestion {
  question: string
  estimatedTime: number // in seconds
}

export interface EvaluationResult {
  score: number
  questions: {
    id: string
    question: string
    userAnswer: string
    improvedAnswer: string
    strengths: string[]
    weaknesses: string[]
  }[]
}

export default function Home() {
  const [view, setView] = useState<ViewType>("landing")
  const [config, setConfig] = useState<InterviewConfig>({
    company: "",
    role: "",
    techStack: "",
    experience: 2,
    resumeFile: null,
    resumeText: null,
    interviewType: "technical",
    difficulty: "intermediate",
    language: "english",
  })
  const [answers, setAnswers] = useState<InterviewAnswer[]>([])
  const [results, setResults] = useState<EvaluationResult | null>(null)
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])

  const handleInterviewEnd = (collectedAnswers: InterviewAnswer[]) => {
    setAnswers(collectedAnswers)
    setView("results")
  }

  const handleQuestionsGenerated = (generatedQuestions: GeneratedQuestion[]) => {
    setQuestions(generatedQuestions)
    setView("interview")
  }

  const navigateTo = (newView: ViewType) => {
    setView(newView)
  }

  return (
    <main className="min-h-screen bg-background">
      {view === "landing" && <LandingView onStart={() => setView("setup")} navigateTo={navigateTo} />}
      {view === "setup" && (
        <SetupView
          config={config}
          setConfig={setConfig}
          onGenerate={handleQuestionsGenerated}
          onBack={() => setView("landing")}
          navigateTo={navigateTo}
        />
      )}
      {view === "interview" && <InterviewView config={config} questions={questions} onEnd={handleInterviewEnd} />}
      {view === "results" && (
        <ResultsView
          answers={answers}
          config={config}
          results={results}
          setResults={setResults}
          onTryAgain={() => {
            setAnswers([])
            setResults(null)
            setQuestions([])
            setView("landing")
          }}
          navigateTo={navigateTo}
        />
      )}
      {view === "faq" && <FAQPage navigateTo={navigateTo} />}
      {view === "team" && <TeamPage navigateTo={navigateTo} />}
      {view === "contact" && <ContactPage navigateTo={navigateTo} />}
    </main>
  )
}
