"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import type { ViewType } from "@/app/page"
import { HelpCircle, Search, ArrowRight } from "lucide-react"

interface FAQPageProps {
  navigateTo: (view: ViewType) => void
}

const faqs = [
  {
    question: "How does InterviewAI work?",
    answer:
      "InterviewAI uses advanced AI technology to generate personalized interview questions based on your target company, role, tech stack, and experience level. During the interview, it uses speech recognition to transcribe your answers in real-time, and after the interview, provides detailed feedback with improved answer suggestions.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, your data security is our top priority. Your interview recordings and transcripts are processed in real-time and are not stored permanently. Resume uploads are only used to personalize your interview questions and are not retained after your session ends.",
  },
  {
    question: "What types of interviews can I practice?",
    answer:
      "You can practice technical interviews (coding, algorithms, system design), behavioral interviews (STAR method questions about past experiences), or mixed interviews that combine both types. You can also select your preferred difficulty level from beginner to expert.",
  },
  {
    question: "Do I need a microphone and camera?",
    answer:
      "A microphone is required for the speech-to-text feature to transcribe your answers. A camera is optional but recommended to simulate real interview conditions. You can toggle video on/off during the interview.",
  },
  {
    question: "How accurate is the speech recognition?",
    answer:
      "We use the browser's native Speech Recognition API which provides high accuracy for clear speech in supported languages. For best results, speak clearly and use a good quality microphone in a quiet environment.",
  },
  {
    question: "Can I upload my resume?",
    answer:
      "Yes! Resume upload is optional but highly recommended. When you upload your resume, our AI analyzes it to generate more personalized questions based on your actual experience and skills.",
  },
  {
    question: "What languages are supported?",
    answer:
      "Currently, we support interviews in English, Hindi, Spanish, German, and French. The AI will generate questions and provide feedback in your selected language.",
  },
  {
    question: "How is my performance scored?",
    answer:
      "Your performance is scored out of 100 based on multiple factors including the completeness of your answers, use of relevant technical terminology, communication clarity, and how well you address the question asked. The AI provides detailed feedback for each answer.",
  },
]

export default function FAQPage({ navigateTo }: FAQPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-black font-sans text-zinc-300 selection:bg-purple-300 selection:text-black">
      <Navbar navigateTo={navigateTo} showBack onBack={() => navigateTo("landing")} />

      {/* Hero Section */}
      <section className="relative pt-12 pb-4 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block mb-6 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900">
             <span className="text-purple-300 font-medium">Support Center</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-purple-300 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-purple-900/20">
            <HelpCircle className="w-8 h-8 text-black" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Frequently Asked{" "}
            <span className="text-blue-300">
              Questions
            </span>
          </h1>

          <p className="text-xl text-zinc-400 leading-relaxed">Everything you need to know about InterviewAI</p>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="px-6 py-12 flex-1">
        <div className="max-w-3xl mx-auto">
          {/* Solid Dark Card */}
          <Card className="border-zinc-800 bg-zinc-900 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`} 
                    className="border-b border-zinc-800 last:border-0 px-6 md:px-10"
                  >
                    <AccordionTrigger className="hover:no-underline py-8 text-left group">
                      <span className="text-white font-bold text-lg pr-4 group-hover:text-purple-300 transition-colors">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 text-zinc-400 text-base leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-20 px-6 border-t border-zinc-900 mt-auto">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16">
                 <h2 className="text-3xl font-bold text-white mb-6 md:mb-0">Still have questions?</h2>
                 <div className="flex bg-zinc-900 p-2 rounded-full w-full md:w-auto max-w-md border border-zinc-800">
                     <div className="flex-grow flex items-center pl-4 text-zinc-400">
                        <Search className="w-5 h-5 mr-3" />
                        <input type="email" placeholder="Ask us anything..." className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-zinc-600" />
                     </div>
                     <button className="inline-flex items-center justify-center h-10 rounded-full bg-white hover:bg-zinc-200 text-black px-8 font-bold transition-colors">Contact</button>
                 </div>
            </div>

            <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-zinc-600 text-sm">
                <p>© 2025 InterviewAI. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                     <button onClick={() => navigateTo("landing")} className="hover:text-white transition-colors">Home</button>
                     <button onClick={() => navigateTo("team" as ViewType)} className="hover:text-white transition-colors">Team</button>
                     <button onClick={() => navigateTo("contact" as ViewType)} className="hover:text-white transition-colors">Contact</button>
                </div>
            </div>
        </div>
      </footer>
    </div>
  )
}