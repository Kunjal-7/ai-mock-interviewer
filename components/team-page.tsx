"use client"

import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import type { ViewType } from "@/app/page"
import { Github, Linkedin, Twitter, Users, ArrowRight, Search, Mail } from "lucide-react"

interface TeamPageProps {
  navigateTo: (view: ViewType) => void
}

const team = [
  {
    name: "Pranav Borse",
    role: "Full Stack Developer",
    bio: "Passionate about building scalable web applications and leading technical teams. Expert in React, Node.js, and cloud architecture.",
    image: "/placeholder.svg?height=200&width=200",
    color: "text-blue-300",
    bgColor: "bg-blue-300",
    borderColor: "border-blue-300/20"
  },
  {
    name: "Kunal Bagade",
    role: "AI/ML Engineer",
    bio: "Specializing in machine learning models and natural language processing systems. Bringing AI magic to interviews.",
    image: "/placeholder.svg?height=200&width=200",
    color: "text-purple-300",
    bgColor: "bg-purple-300",
    borderColor: "border-purple-300/20"
  },
  {
    name: "Kunjal Desale",
    role: "Frontend Developer",
    bio: "Creating beautiful and intuitive user interfaces with modern frameworks. Making sure every pixel is perfect.",
    image: "/placeholder.svg?height=200&width=200",
    color: "text-pink-300",
    bgColor: "bg-pink-300",
    borderColor: "border-pink-300/20"
  },
  {
    name: "Swati Gaikwad",
    role: "Backend Developer",
    bio: "Building robust APIs and database architectures for high-performance applications. The backbone of our system.",
    image: "/placeholder.svg?height=200&width=200",
    color: "text-emerald-300",
    bgColor: "bg-emerald-300",
    borderColor: "border-emerald-300/20"
  },
]

export default function TeamPage({ navigateTo }: TeamPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-black font-sans text-zinc-300 selection:bg-purple-300 selection:text-black">
      <Navbar navigateTo={navigateTo} showBack onBack={() => navigateTo("landing")} />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
           {/* Badge */}
           <div className="inline-block mb-6 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900">
             <span className="text-purple-300 font-medium">The Minds Behind AI</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-pink-300 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-pink-900/20">
            <Users className="w-8 h-8 text-black" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Meet Our{" "}
            <span className="text-pink-300">
              Team
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            We are a passionate team of developers and AI enthusiasts dedicated to helping you succeed in your interviews.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="px-6 py-12 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group h-full">
                <Card className={`h-full bg-zinc-900 border ${member.borderColor} rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:border-zinc-700`}>
                  <CardContent className="p-8 text-center flex flex-col h-full">
                    
                    {/* Image Area */}
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <div className={`absolute inset-0 rounded-full ${member.bgColor} opacity-10 group-hover:scale-110 transition-transform duration-500`} />
                      <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover border-4 border-black relative z-10"
                      />
                      {/* Decorative dot */}
                      <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full ${member.bgColor} border-4 border-zinc-900 z-20`}></div>
                    </div>

                    <h3 className="font-bold text-xl text-white mb-2">{member.name}</h3>
                    <p className={`text-sm font-bold uppercase tracking-wider mb-4 ${member.color}`}>
                      {member.role}
                    </p>

                    <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-grow">{member.bio}</p>

                    {/* Social Links */}
                    <div className="flex items-center justify-center gap-3 pt-6 border-t border-zinc-800">
                      <button className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-colors">
                        <Github className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-colors">
                        <Twitter className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA - Solid Block Style */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-emerald-300 rounded-[3rem] p-12 text-center">
             <h2 className="text-3xl md:text-5xl font-bold text-black mb-6">Want to join our team?</h2>
             <p className="text-emerald-950/80 mb-10 text-lg max-w-lg mx-auto font-medium">
                We are always looking for talented individuals who share our passion for AI and helping people succeed.
             </p>
             <button
               onClick={() => navigateTo("contact")}
               className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-black text-white font-bold hover:bg-zinc-800 transition-colors text-lg"
             >
               Get in touch
               <Mail className="w-5 h-5" />
             </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-20 px-6 border-t border-zinc-900 mt-auto">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16">
                 <h2 className="text-3xl font-bold text-white mb-6 md:mb-0">Connect with the Team</h2>
                 <div className="flex bg-zinc-900 p-2 rounded-full w-full md:w-auto max-w-md border border-zinc-800">
                     <div className="flex-grow flex items-center pl-4 text-zinc-400">
                        <Search className="w-5 h-5 mr-3" />
                        <input type="email" placeholder="Search team members..." className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-zinc-600" />
                     </div>
                     <button className="inline-flex items-center justify-center h-10 rounded-full bg-white hover:bg-zinc-200 text-black px-8 font-bold transition-colors">Search</button>
                 </div>
            </div>

            <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-zinc-600 text-sm">
                <p>© 2025 InterviewAI. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                     <button onClick={() => navigateTo("landing")} className="hover:text-white transition-colors">Home</button>
                     <button onClick={() => navigateTo("faq")} className="hover:text-white transition-colors">FAQ</button>
                     <button onClick={() => navigateTo("contact" as ViewType)} className="hover:text-white transition-colors">Contact</button>
                </div>
            </div>
        </div>
      </footer>
    </div>
  )
}