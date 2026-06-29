"use client"

import type { ViewType } from "@/app/page"
import Navbar from "@/components/navbar"
import { cn } from "@/lib/utils"
import { Mic, Brain, Target, Check, ArrowRight, Play, Search, Video, BarChart, Users, Globe, Zap } from "lucide-react"

interface LandingViewProps {
  onStart: () => void
  navigateTo: (view: ViewType) => void
}

export default function LandingView({ onStart, navigateTo }: LandingViewProps) {
  // Feature cards with UNIQUE icons
  const featureCards = [
    { icon: Mic, title: "Practice Mode", subtitle: "Simulate real interviews", color: "bg-blue-200", textColor: "text-blue-950" },
    { icon: Search, title: "Resume Scan", subtitle: "Tailored questions from CV", color: "bg-purple-200", textColor: "text-purple-950" },
    { icon: Target, title: "Performance", subtitle: "Track your improvement", color: "bg-emerald-200", textColor: "text-emerald-950" },
    { icon: Brain, title: "Instant Feedback", subtitle: "AI analysis in seconds", color: "bg-pink-200", textColor: "text-pink-950" },
  ]

  // Vision cards
  const visionCards = [
    { title: "Build Confidence", desc: "Overcome anxiety through repeated, realistic practice.", accent: "text-blue-200", border: "border-blue-900" },
    { title: "Refine Answers", desc: "Learn to structure responses using industry best practices.", accent: "text-purple-200", border: "border-purple-900" },
    { title: "Master Technicals", desc: "Deep dive into role-specific technical questions.", accent: "text-emerald-200", border: "border-emerald-900" },
    { title: "Improve Delivery", desc: "Enhance your tone, pace, and clarity of speech.", accent: "text-pink-200", border: "border-pink-900" },
  ]

  return (
    // Base theme: Pure Black background, Zinc text
    <div className="min-h-screen flex flex-col bg-black font-sans text-zinc-300 selection:bg-purple-300 selection:text-black">
      <Navbar navigateTo={navigateTo} />

      {/* --- Hero Section --- */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block mb-6 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900">
             <span className="text-purple-300 font-medium">Get Started with InterviewAI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
            Discover Our Mission in <br />
            <span className="text-blue-300">
              AI-Centered Interview Prep
            </span>
          </h1>

          <p className="text-xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            We are dedicated to providing exceptional preparation through an intelligent,
            context-aware approach. Master your next interview.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            {/* Solid Pastel Button - Wired to onStart */}
            <button
              onClick={onStart}
              className="inline-flex border items-center justify-center h-14 px-10 rounded-full cursor-pointer hover:text-white hover:bg-transparent hover:border hover:border-white bg-white duration-300 text-black text-lg font-bold transition-colors"
            >
              Start Practicing
              <Play className="w-5 h-5 ml-2 -mr-1 fill-current" />
            </button>
            {/* Outline Button */}
            <button
              onClick={() => navigateTo("faq")}
              className="inline-flex items-center justify-center h-14 px-10 rounded-full border-2 cursor-pointer border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-white bg-transparent text-lg font-medium transition-colors"
            >
              How it Works
            </button>
          </div>

          {/* Floating Stats Block - Solid Dark Blocks */}
          <div className="relative max-w-4xl mx-auto mt-16">
            {/* The main stats card overlapping */}
            <div className="bg-zinc-900 rounded-[3rem] p-8 md:p-12 border border-zinc-800">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                 {/* Stat 1 */}
                <div className="flex items-center gap-4 pr-8 border-r border-zinc-800">
                    <div className="w-12 h-12 rounded-full bg-blue-300 flex items-center justify-center text-black">
                        <Target className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <div className="text-3xl font-bold text-white">95%</div>
                        <div className="text-sm text-zinc-400">Positive Feedback</div>
                    </div>
                </div>
                 {/* Stat 2 */}
                 <div className="flex items-center gap-4 pr-8 md:border-r border-zinc-800">
                    <div className="text-left">
                        <div className="text-3xl font-bold text-white">50+</div>
                        <div className="text-sm text-zinc-400">Interviews Practiced</div>
                    </div>
                </div>
                 {/* Stat 3 */}
                 <div className="flex items-center gap-4 col-span-2 md:col-span-1 justify-center md:justify-start pt-8 md:pt-0 border-t md:border-t-0 border-zinc-800">
                    <div className="text-left relative">
                        <div className="text-3xl font-bold text-white">4.3</div>
                        <div className="text-sm text-zinc-400">User Rating</div>
                        <Brain className="w-5 h-5 text-purple-300 absolute -top-2 -right-6" />
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 1: Trusted Layout --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Your Trusted Interview Coach</h2>
            <p className="text-zinc-400 max-w-2xl mb-16">We provide the tools and insights you need to succeed. Our AI is trained on thousands of real interview questions.</p>

            <div className="grid lg:grid-cols-5 gap-8">
                {/* Large Left Card - Solid Dark Grey with Pastel Elements */}
                <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 text-white relative overflow-hidden">
                    <h3 className="text-3xl font-bold mb-4 relative z-10 text-white">AI Powered <br/>Realtime Feedback</h3>
                    <p className="text-zinc-400 mb-8 max-w-md relative z-10">Connect with our advanced AI to receive instant analysis on your speech, content, and delivery.</p>
                    {/* Wired to onStart */}
                    <button 
                        onClick={onStart}
                        className="inline-flex items-center cursor-pointer duration-300 justify-center rounded-full bg-purple-300 text-black hover:bg-purple-200 px-8 h-12 font-bold relative z-10 border-none transition-colors"
                    >
                        Try it now
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    
                    {/* Abstract Decoration */}
                    <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center">
                         <Mic className="w-10 h-10 text-purple-300" />
                    </div>
                </div>

                {/* Right side column with 2 smaller cards */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Top Small Card */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 flex items-center justify-between">
                        <div>
                            <h4 className="text-4xl font-bold text-white mb-2">100%</h4>
                            <p className="text-zinc-500">Personalized</p>
                        </div>
                        <div className="w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center text-black">
                             <Target className="w-8 h-8" />
                        </div>
                    </div>
                    {/* Bottom Small Card */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 flex items-center justify-between">
                        <div>
                            <h4 className="text-4xl font-bold text-white mb-2">24 <span className="text-zinc-600">by</span> 7</h4>
                            <p className="text-zinc-500">Availability</p>
                        </div>
                        <div className="w-16 h-16 bg-emerald-300 rounded-full flex items-center justify-center text-black">
                             <Brain className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- Section 2: Goals Layout (Updated Visuals) --- */}
      <section className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="order-2 md:order-1">
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-pink-900/30 bg-pink-900/10">
                    <span className="text-pink-300 text-sm font-medium tracking-wide">Our Mission</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    Democratizing access to <br />
                    <span className="text-pink-300">Elite Career Coaching</span>
                </h2>
                <p className="text-zinc-400 mb-10 text-lg leading-relaxed">
                    We believe everyone deserves the chance to land their dream job. Our AI-driven approach breaks down barriers, providing personalized mentorship that was once reserved for the few.
                </p>

                <div className="space-y-4">
                    {[
                        { text: "Accessible AI tools for everyone", icon: Users, color: "bg-blue-300" },
                        { text: "Reducing interview anxiety through practice", icon: Zap, color: "bg-purple-300" },
                        { text: "Improving communication skills globally", icon: Globe, color: "bg-emerald-300" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                            <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center flex-shrink-0 text-black shadow-lg`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-white font-medium text-lg">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Tech UI Mockup */}
            <div className="order-1 md:order-2 relative h-[600px] bg-zinc-950 rounded-[3rem] overflow-hidden border border-zinc-800 flex flex-col items-center justify-center p-8 shadow-2xl">
                 {/* Gradient Background */}
                 <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black pointer-events-none" />

                 {/* Simulated Interface */}
                 <div className="w-full max-w-sm bg-black border border-zinc-800 rounded-3xl p-6 relative shadow-2xl z-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-full bg-emerald-300 flex items-center justify-center shadow-emerald-900/20 shadow-lg">
                           <span className="text-black font-bold text-lg">AI</span>
                        </div>
                        <div>
                           <div className="text-white text-base font-bold">Mock Interview</div>
                           <div className="text-zinc-500 text-xs tracking-wide">LIVE SESSION</div>
                        </div>
                        <div className="ml-auto flex items-center gap-2 bg-red-950/30 px-3 py-1 rounded-full border border-red-900/50">
                           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                           <span className="text-red-500 text-xs font-bold tracking-wider">REC</span>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-zinc-900 rounded-2xl p-6 mb-8 border border-zinc-800 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                        <p className="text-zinc-400 text-xs uppercase tracking-widest mb-3 font-semibold">Question 1/5</p>
                        <p className="text-white font-medium text-lg leading-relaxed">"Tell me about a challenging project you worked on and how you overcame obstacles."</p>
                    </div>

                    {/* Audio Viz */}
                    <div className="flex items-center justify-between gap-1 h-16 mb-8 px-4">
                        {[40, 70, 30, 80, 50, 90, 40, 60, 30, 50, 70, 40, 80, 50, 30].map((h, i) => (
                           <div key={i} className="w-1.5 bg-purple-400 rounded-full transition-all duration-300" style={{ height: `${h}%`, opacity: i % 2 === 0 ? 1 : 0.6 }}></div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-6">
                        <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:bg-zinc-800 transition-colors cursor-pointer"><Mic className="w-6 h-6"/></div>
                        <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-400 transition-colors shadow-lg shadow-red-900/20 cursor-pointer"><Video className="w-6 h-6"/></div>
                        <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:bg-zinc-800 transition-colors cursor-pointer"><BarChart className="w-6 h-6"/></div>
                    </div>
                 </div>

                 {/* Floating Success Badge */}
                 <div className="absolute bottom-20 -right-6 p-5 bg-blue-200 text-blue-950 rounded-2xl shadow-xl transform -rotate-6 border-4 border-black z-20">
                     <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                             <Check className="w-6 h-6 text-blue-600" strokeWidth={3} />
                         </div>
                         <div>
                             <div className="font-bold text-lg">Excellent !</div>
                             <div className="text-xs font-semibold opacity-75 uppercase tracking-wide">Structure Score: 98/100</div>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
      </section>

       {/* --- Section 3: Features --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
                <p className="text-zinc-400 max-w-2xl mx-auto">Explore the tools that will give you the competitive edge.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
                {featureCards.map((card, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-4 text-center group transition-all hover:border-zinc-700">
                        {/* Solid Pastel Color Block Top */}
                        <div className={`h-48 rounded-[2.5rem] ${card.color} mb-6 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
                             {/* Using the specific icon for each card */}
                             <card.icon className={`w-20 h-20 ${card.textColor} opacity-20`} />
                             <span className={`absolute bottom-4 font-bold ${card.textColor} uppercase tracking-widest text-xs`}>Feature 0{i+1}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                        <p className="text-zinc-400 text-sm mb-6">{card.subtitle}</p>
                        
                         <div className="flex justify-center gap-2 pb-4">
                             <div className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-white hover:text-black transition-colors cursor-pointer">
                                 <ArrowRight className="w-4 h-4" />
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- Section 4: Vision Cards --- */}
      <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Your Path to Success</h2>
                <p className="text-zinc-400">Our vision is your career growth.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {visionCards.map((card, i) => (
                    <div key={i} className={`bg-black border ${card.border} rounded-[2.5rem] p-8 relative group hover:bg-zinc-900 transition-colors`}>
                        <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black transition-all">
                             <ArrowRight className="w-4 h-4 -rotate-45" />
                        </div>
                        <div className={`font-bold text-xl mb-8 ${card.accent}`}>0{i+1}</div>
                        <h3 className="text-xl font-bold text-white mb-4">{card.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">{card.desc}</p>
                    </div>
                ))}
            </div>
          </div>
      </section>
      
      {/* --- Footer --- */}
      <footer className="bg-black py-20 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16">
                 <h2 className="text-3xl font-bold text-white mb-6 md:mb-0">Let's Connect with us</h2>
                 <div className="flex bg-zinc-900 p-2 rounded-full w-full md:w-auto max-w-md border border-zinc-800">
                     <div className="flex-grow flex items-center pl-4 text-zinc-400">
                        <Search className="w-5 h-5 mr-3" />
                        <input type="email" placeholder="Enter your email address" className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-zinc-600" />
                     </div>
                     <button className="inline-flex items-center justify-center h-10 rounded-full bg-white hover:bg-zinc-200 text-black px-8 font-bold transition-colors">Subscribe</button>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm border-t border-zinc-900 pt-16">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-black font-bold">AI</div>
                        <span className="text-2xl font-bold text-white">InterviewAI</span>
                    </div>
                    <p className="text-zinc-500 leading-relaxed mb-6 max-w-sm">
                        Subscribe our newsletter for latest updates and features. We promise not to spam your inbox.
                    </p>
                </div>

                <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-8 md:justify-end items-start">
                    <button onClick={() => navigateTo("faq")} className="text-zinc-400 hover:text-white hover:underline transition-colors text-base font-medium">FAQ</button>
                    <button onClick={() => navigateTo("team" as ViewType)} className="text-zinc-400 hover:text-white hover:underline transition-colors text-base font-medium">Our Team</button>
                    <button onClick={() => navigateTo("contact" as ViewType)} className="text-zinc-400 hover:text-white hover:underline transition-colors text-base font-medium">Contact</button>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-zinc-600 text-sm">
                <p>© 2025 InterviewAI. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                     <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"><ArrowRight className="w-3 h-3" /></div>
                     <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"><ArrowRight className="w-3 h-3" /></div>
                     <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"><ArrowRight className="w-3 h-3" /></div>
                </div>
            </div>
        </div>
      </footer>
    </div>
  )
}