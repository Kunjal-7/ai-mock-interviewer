"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { InterviewAnswer, EvaluationResult, InterviewConfig, ViewType } from "@/app/page"
import { evaluateInterview } from "@/app/actions/gemini"
import Navbar from "@/components/navbar"
import { 
  Bot, 
  CheckCircle, 
  Loader2, 
  RefreshCcw, 
  Share2, 
  XCircle, 
  Trophy, 
  TrendingUp, 
  Target, 
  Sparkles, 
  FileText, 
  Download, 
  Home,
  Clock,
  Briefcase
} from "lucide-react"

interface ResultsViewProps {
  answers: InterviewAnswer[]
  config: InterviewConfig
  results: EvaluationResult | null
  setResults: (results: EvaluationResult) => void
  onTryAgain: () => void
  navigateTo: (view: ViewType) => void
}

export default function ResultsView({
  answers,
  config,
  results,
  setResults,
  onTryAgain,
  navigateTo,
}: ResultsViewProps) {
  const [isLoading, setIsLoading] = useState(!results)
  const [isExporting, setIsExporting] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!results && answers.length > 0) {
      setIsLoading(true)
      evaluateInterview(answers, config)
        .then((evaluationResults) => {
          setResults(evaluationResults)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Evaluation error:", error)
          setIsLoading(false)
        })
    }
  }, [answers, config, results, setResults])

  const circumference = 2 * Math.PI * 60
  const progress = results ? (results.score / 100) * circumference : 0

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-300"
    if (score >= 60) return "text-blue-300"
    if (score >= 40) return "text-yellow-300"
    return "text-red-400"
  }

  const getStrokeColor = (score: number) => {
    if (score >= 80) return "text-emerald-300"
    if (score >= 60) return "text-blue-300"
    if (score >= 40) return "text-yellow-300"
    return "text-red-400"
  }

  const handleExportPDF = async () => {
    if (!results) return
    setIsExporting(true)

    try {
      const { default: jsPDF } = await import("jspdf")

      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      let yPosition = margin

      // Colors matching the theme (Hex approximations)
      const darkBg = "#000000" // Black
      const cardBg = "#18181b" // Zinc-900
      const primaryColor = "#d8b4fe" // Purple-300
      const textColor = "#e4e4e7" // Zinc-200
      const mutedColor = "#a1a1aa" // Zinc-400

      pdf.setFillColor(darkBg)
      pdf.rect(0, 0, pageWidth, pageHeight, "F")

      pdf.setFillColor(cardBg)
      pdf.roundedRect(margin, yPosition, pageWidth - margin * 2, 25, 3, 3, "F")

      pdf.setTextColor(primaryColor)
      pdf.setFontSize(20)
      pdf.setFont("helvetica", "bold")
      pdf.text("InterviewAI", margin + 5, yPosition + 10)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(mutedColor)
      pdf.text("Interview Performance Report", margin + 5, yPosition + 18)

      pdf.setFontSize(9)
      pdf.text(new Date().toLocaleDateString("en-US", { dateStyle: "long" }), pageWidth - margin - 35, yPosition + 10)

      yPosition += 35

      pdf.setFillColor(cardBg)
      pdf.roundedRect(margin, yPosition, pageWidth - margin * 2, 50, 3, 3, "F")

      const scoreX = margin + 30
      const scoreY = yPosition + 25
      pdf.setDrawColor(39, 39, 42) // Zinc-800 border
      pdf.setLineWidth(0.5)
      pdf.circle(scoreX, scoreY, 15)

      // Simplified score indicator for PDF
      pdf.setDrawColor(216, 180, 254) // Purple-300
      pdf.setLineWidth(2)
      pdf.circle(scoreX, scoreY, 15)

      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.text(results.score.toString(), scoreX - 6, scoreY + 2)

      pdf.setFontSize(8)
      pdf.setTextColor(mutedColor)
      pdf.text("/ 100", scoreX + 5, scoreY + 2)

      pdf.setTextColor(textColor)
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      const performanceText =
        results.score >= 80
          ? "Excellent Performance!"
          : results.score >= 60
            ? "Good Performance!"
            : results.score >= 40
              ? "Room for Growth"
              : "Keep Practicing!"
      pdf.text(performanceText, margin + 55, yPosition + 18)

      pdf.setTextColor(mutedColor)
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "normal")
      const summaryText =
        results.score >= 80
          ? "You demonstrated strong technical knowledge and excellent communication skills."
          : results.score >= 60
            ? "You showed solid understanding of the topics. Review feedback to improve further."
            : "Every interview is a learning opportunity. Study the improved answers below."
      const summaryLines = pdf.splitTextToSize(summaryText, pageWidth - margin * 2 - 60)
      pdf.text(summaryLines, margin + 55, yPosition + 26)

      yPosition += 60

      pdf.setFillColor(cardBg)
      pdf.roundedRect(margin, yPosition, pageWidth - margin * 2, 20, 3, 3, "F")

      pdf.setTextColor(primaryColor)
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "bold")
      pdf.text("Interview Details", margin + 5, yPosition + 8)

      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(textColor)
      pdf.setFontSize(8)
      pdf.text(`Company: ${config.company}`, margin + 5, yPosition + 15)
      pdf.text(`Role: ${config.role}`, margin + 60, yPosition + 15)
      pdf.text(`Experience: ${config.experience} years`, margin + 110, yPosition + 15)

      yPosition += 28

      for (let i = 0; i < results.questions.length; i++) {
        const q = results.questions[i]

        if (yPosition > pageHeight - 80) {
          pdf.addPage()
          pdf.setFillColor(darkBg)
          pdf.rect(0, 0, pageWidth, pageHeight, "F")
          yPosition = margin
        }

        pdf.setFillColor(cardBg)
        // Manual wrapping for Q&A
        const questionLines = pdf.splitTextToSize(`Q${i + 1}: ${q.question}`, pageWidth - margin * 2 - 10)
        const userAnswerLines = pdf.splitTextToSize(
          `Your Answer: ${q.userAnswer || "(No response)"}`,
          pageWidth - margin * 2 - 10,
        )
        const aiAnswerLines = pdf.splitTextToSize(`AI Suggestion: ${q.improvedAnswer}`, pageWidth - margin * 2 - 10)

        const cardHeight = 25 + questionLines.length * 4 + userAnswerLines.length * 4 + aiAnswerLines.length * 4

        if (yPosition + cardHeight > pageHeight - margin) {
          pdf.addPage()
          pdf.setFillColor(darkBg)
          pdf.rect(0, 0, pageWidth, pageHeight, "F")
          yPosition = margin
        }

        pdf.roundedRect(margin, yPosition, pageWidth - margin * 2, cardHeight, 3, 3, "F")

        pdf.setTextColor(primaryColor)
        pdf.setFontSize(9)
        pdf.setFont("helvetica", "bold")
        pdf.text(questionLines, margin + 5, yPosition + 8)

        let textY = yPosition + 8 + questionLines.length * 4 + 4

        pdf.setTextColor(textColor)
        pdf.setFontSize(8)
        pdf.setFont("helvetica", "normal")
        pdf.text(userAnswerLines, margin + 5, textY)
        textY += userAnswerLines.length * 4 + 4

        pdf.setTextColor(mutedColor) // Zinc-400 equivalent
        pdf.text(aiAnswerLines, margin + 5, textY)

        yPosition += cardHeight + 5
      }

      pdf.setTextColor(mutedColor)
      pdf.setFontSize(8)
      pdf.text("Generated by InterviewAI", pageWidth / 2, pageHeight - 10, {
        align: "center",
      })

      pdf.save(`InterviewAI-Report-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("PDF export error:", error)
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-black font-sans text-zinc-300">
        <Navbar navigateTo={navigateTo} showBack onBack={() => navigateTo("landing")} />
        <section className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
               <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
               <div className="absolute inset-0 rounded-full border-4 border-purple-300 border-t-transparent animate-spin"></div>
               <Bot className="absolute inset-0 m-auto w-8 h-8 text-purple-300" />
            </div>
            <h2 className="text-3xl font-bold text-white">Analyzing Your Interview</h2>
            <p className="text-zinc-500 max-w-md mx-auto">
              Our AI is evaluating your responses, identifying strengths, and preparing personalized feedback...
            </p>
          </div>
        </section>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-zinc-300">
        <div className="text-center space-y-4">
          <p className="text-zinc-500">No results available</p>
          <Button onClick={onTryAgain} className="bg-white text-black hover:bg-zinc-200">Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-black font-sans text-zinc-300 selection:bg-purple-300 selection:text-black" ref={reportRef}>
      <Navbar navigateTo={navigateTo} showBack onBack={() => navigateTo("landing")} />

      {/* Hero Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-12">
         <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
               <h1 className="text-3xl font-bold text-white mb-2">Evaluation Report</h1>
               <p className="text-zinc-400 text-sm">Comprehensive analysis of your performance</p>
            </div>
            <div className="flex items-center gap-3">
               <Button
                  variant="outline"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="bg-black border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 gap-2"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Export PDF
                </Button>
                <Button 
                  onClick={onTryAgain}
                  className="bg-purple-300 hover:bg-purple-200 text-black gap-2 font-bold"
                >
                  <RefreshCcw className="w-4 h-4" />
                  New Interview
                </Button>
            </div>
         </div>
      </div>

      {/* Results Content */}
      <section className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Score Card */}
          <div className="grid md:grid-cols-3 gap-6">
             <Card className="md:col-span-2 border-zinc-800 bg-zinc-900 rounded-[2rem] overflow-hidden shadow-xl">
               <CardContent className="p-8 flex flex-col sm:flex-row items-center gap-8">
                  {/* Radial Chart */}
                  <div className="relative w-40 h-40 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                      <circle
                        cx="70"
                        cy="70"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-zinc-800"
                      />
                      <circle
                        cx="70"
                        cy="70"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        className={`transition-all duration-1000 ${getStrokeColor(results.score)}`}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-4xl font-bold ${getScoreColor(results.score)}`}>{results.score}</span>
                      <span className="text-xs text-zinc-500 uppercase tracking-widest">Score</span>
                    </div>
                  </div>

                  {/* Summary Text */}
                  <div className="text-center sm:text-left space-y-3">
                     <div className="flex items-center justify-center sm:justify-start gap-2">
                        {results.score >= 80 && <Trophy className="w-6 h-6 text-yellow-400" />}
                        <h2 className="text-2xl font-bold text-white">
                          {results.score >= 80 ? "Outstanding!" : results.score >= 60 ? "Good Job!" : "Keep Learning"}
                        </h2>
                     </div>
                     <p className="text-zinc-400 text-sm leading-relaxed">
                        {results.score >= 80
                          ? "You demonstrated excellent technical proficiency and clear communication. You're interview-ready!"
                          : results.score >= 60
                            ? "Solid performance with some great answers. Focus on the areas for improvement below to reach the next level."
                            : "This was a good practice session. Review the AI's suggested answers to strengthen your technical concepts."}
                     </p>
                  </div>
               </CardContent>
             </Card>

             {/* Stats Column */}
             <div className="space-y-4">
                <Card className="border-zinc-800 bg-zinc-900 rounded-3xl p-4 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-blue-300/10 flex items-center justify-center text-blue-300">
                      <Target className="w-6 h-6" />
                   </div>
                   <div>
                      <div className="text-2xl font-bold text-white">{results.questions.length}</div>
                      <div className="text-xs text-zinc-500 uppercase font-bold">Total Questions</div>
                   </div>
                </Card>
                <Card className="border-zinc-800 bg-zinc-900 rounded-3xl p-4 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-300/10 flex items-center justify-center text-emerald-300">
                      <CheckCircle className="w-6 h-6" />
                   </div>
                   <div>
                      <div className="text-2xl font-bold text-white">{results.questions.reduce((acc, q) => acc + q.strengths.length, 0)}</div>
                      <div className="text-xs text-zinc-500 uppercase font-bold">Key Strengths</div>
                   </div>
                </Card>
                <Card className="border-zinc-800 bg-zinc-900 rounded-3xl p-4 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-pink-300/10 flex items-center justify-center text-pink-300">
                      <TrendingUp className="w-6 h-6" />
                   </div>
                   <div>
                      <div className="text-2xl font-bold text-white">{results.questions.filter((q) => q.userAnswer && q.userAnswer.length > 50).length}</div>
                      <div className="text-xs text-zinc-500 uppercase font-bold">Detailed Answers</div>
                   </div>
                </Card>
             </div>
          </div>

          {/* Configuration Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
                { label: "Role", val: config.role, icon: Briefcase },
                { label: "Experience", val: `${config.experience} Years`, icon: TrendingUp },
                { label: "Type", val: config.interviewType, icon: Target },
                { label: "Language", val: config.language, icon: Bot } // Using Bot as placeholder for Language
             ].map((item, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center text-center">
                   <item.icon className="w-5 h-5 text-zinc-500 mb-2" />
                   <span className="text-xs text-zinc-500 uppercase font-bold mb-1">{item.label}</span>
                   <span className="text-white font-medium capitalize">{item.val}</span>
                </div>
             ))}
          </div>

          {/* Detailed Feedback Accordion */}
          <div className="space-y-6">
             <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-300" />
                Question Analysis
             </h3>
             
             <div className="space-y-4">
               {results.questions.map((q, index) => (
                 <Card key={q.id} className="border-zinc-800 bg-zinc-900 rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-0">
                       <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value={q.id} className="border-0">
                             <AccordionTrigger className="px-8 py-6 hover:no-underline hover:bg-zinc-800/50 transition-colors">
                                <div className="flex items-start gap-4 text-left w-full">
                                   <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400 border border-zinc-700">
                                      {index + 1}
                                   </span>
                                   <span className="text-lg font-medium text-white pt-1">{q.question}</span>
                                </div>
                             </AccordionTrigger>
                             <AccordionContent className="px-8 pb-8 pt-2">
                                <div className="space-y-8 ml-12 border-l-2 border-zinc-800 pl-8">
                                   
                                   {/* User Answer */}
                                   <div className="space-y-2">
                                      <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Your Response</h4>
                                      <p className="text-zinc-300 leading-relaxed italic">
                                         "{q.userAnswer || <span className="text-zinc-600">No answer provided</span>}"
                                      </p>
                                   </div>

                                   {/* AI Feedback */}
                                   <div className="bg-purple-300/5 border border-purple-300/10 rounded-2xl p-6 relative">
                                      <div className="absolute -top-3 left-6 px-3 py-1 bg-purple-300 text-black text-xs font-bold rounded-full uppercase tracking-wide">
                                         AI Suggestion
                                      </div>
                                      <p className="text-zinc-300 leading-relaxed mt-2">
                                         {q.improvedAnswer}
                                      </p>
                                   </div>

                                   {/* Grid of Strengths/Weaknesses */}
                                   <div className="grid md:grid-cols-2 gap-6">
                                      <div>
                                         <h4 className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" /> Strengths
                                         </h4>
                                         <ul className="space-y-2">
                                            {q.strengths.map((str, i) => (
                                               <li key={i} className="text-zinc-400 text-sm flex items-start gap-2">
                                                  <span className="text-emerald-400/50 mt-1">•</span> {str}
                                               </li>
                                            ))}
                                         </ul>
                                      </div>
                                      <div>
                                         <h4 className="text-red-400 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <XCircle className="w-4 h-4" /> Improvements
                                         </h4>
                                         <ul className="space-y-2">
                                            {q.weaknesses.map((weak, i) => (
                                               <li key={i} className="text-zinc-400 text-sm flex items-start gap-2">
                                                  <span className="text-red-400/50 mt-1">•</span> {weak}
                                               </li>
                                            ))}
                                         </ul>
                                      </div>
                                   </div>

                                </div>
                             </AccordionContent>
                          </AccordionItem>
                       </Accordion>
                    </CardHeader>
                 </Card>
               ))}
             </div>
          </div>

        </div>
      </section>
    </div>
  )
}