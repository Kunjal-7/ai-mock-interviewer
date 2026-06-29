"use client"

import type { ViewType } from "@/app/page"
import { ArrowLeft } from "lucide-react"

interface NavbarProps {
  navigateTo: (view: ViewType) => void
  showBack?: boolean
  onBack?: () => void
}

export default function Navbar({ navigateTo, showBack, onBack }: NavbarProps) {
  return (
    <header className=" top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <button
          onClick={() => navigateTo("landing")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-300 flex items-center justify-center shadow-[0_0_0_1px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_0_2px_rgba(216,180,254,0.4)] transition-all">
            <span className="text-sm font-bold text-black">AI</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">InterviewAI</span>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigateTo("landing")}
            className="text-sm font-medium cursor-pointer text-zinc-400 hover:text-white transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => navigateTo("faq")}
            className="text-sm font-medium cursor-pointer text-zinc-400 hover:text-white transition-colors"
          >
            FAQ
          </button>
          <button
            onClick={() => navigateTo("team" as ViewType)}
            className="text-sm font-medium cursor-pointer text-zinc-400 hover:text-white transition-colors"
          >
            Our Team
          </button>
          <button
            onClick={() => navigateTo("contact" as ViewType)}
            className="text-sm font-medium cursor-pointer text-zinc-400 hover:text-white transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Action Buttons */}
        <div>
          {showBack && onBack ? (
            <button 
              onClick={onBack} 
              className="flex items-center cursor-pointer gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <button
              onClick={() => navigateTo("setup")}
              className="hidden cursor-pointer md:flex items-center justify-center h-10 px-6 rounded-full bg-white hover:bg-zinc-200 text-black text-sm font-bold transition-colors"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </header>
  )
}