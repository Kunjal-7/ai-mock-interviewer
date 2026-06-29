"use client"

import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import type { ViewType } from "@/app/page"
import { Mail, Phone, MapPin, Clock, MessageCircle, Globe, ArrowRight, Search } from "lucide-react"

interface ContactPageProps {
  navigateTo: (view: ViewType) => void
}

export default function ContactPage({ navigateTo }: ContactPageProps) {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      subtitle: "We'll respond within 24 hours",
      value: "support@interviewai.com",
      href: "mailto:support@interviewai.com",
      color: "bg-blue-300",
      textColor: "text-blue-950"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      subtitle: "Mon-Fri from 9am to 6pm IST",
      value: "+91 98765 43210",
      href: "tel:+919876543210",
      color: "bg-purple-300",
      textColor: "text-purple-950"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Office Address",
      subtitle: "Tech Park, Hinjewadi Phase 1",
      value: "Pune, Maharashtra 411057, India",
      href: null,
      color: "bg-emerald-300",
      textColor: "text-emerald-950"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      subtitle: "Monday - Friday: 9AM - 6PM",
      value: "Saturday: 10AM - 2PM",
      href: null,
      color: "bg-pink-300",
      textColor: "text-pink-950"
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-black font-sans text-zinc-300 selection:bg-purple-300 selection:text-black">
      <Navbar navigateTo={navigateTo} showBack onBack={() => navigateTo("landing")} />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900">
             <span className="text-purple-300 font-medium flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Get In Touch
             </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Contact{" "}
            <span className="text-blue-300">
              Us
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Have questions or feedback? We'd love to hear from you. Reach out through any of our channels below.
          </p>
        </div>
      </section>

      {/* Contact Cards + Map */}
      <section className="px-6 py-12 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="group">
                  <Card className="border-zinc-800 bg-zinc-900 rounded-[2rem] hover:border-zinc-700 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-5">
                        <div className={`w-14 h-14 rounded-2xl ${item.color} ${item.textColor} flex items-center justify-center shrink-0 shadow-lg`}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                          <p className="text-sm text-zinc-500 mb-2">{item.subtitle}</p>
                          {item.href ? (
                            <a href={item.href} className="text-white hover:text-blue-300 transition-colors font-medium text-sm break-all flex items-center gap-1 group-hover:underline">
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-zinc-300 text-sm font-medium">{item.value}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <div className="relative h-full min-h-[500px]">
                <Card className="border-zinc-800 bg-zinc-900 rounded-[2.5rem] h-full overflow-hidden">
                  <CardContent className="p-0 h-full">
                    <div className="relative h-full min-h-[500px]">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.6953903058455!2d73.73799611489431!3d18.59108898738979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb000dc8cf15%3A0xb97ec0d0b23a5a!2sHinjewadi%20Phase%201%2C%20Hinjawadi%2C%20Pimpri-Chinchwad%2C%20Maharashtra%20411057!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0, minHeight: "500px" }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Office Location"
                        className="grayscale opacity-50 invert-[.9] hover:invert-0 hover:grayscale-0 hover:opacity-80 transition-all duration-700"
                      />

                      {/* Map Overlay */}
                      <div className="absolute top-6 left-6 right-6 pointer-events-none">
                        <div className="bg-black/80 backdrop-blur-md rounded-2xl p-5 border border-zinc-800 inline-block pointer-events-auto">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-300 flex items-center justify-center text-purple-950">
                              <Globe className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg">InterviewAI HQ</h3>
                              <p className="text-sm text-zinc-400">Pune, Maharashtra, India</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
                     <button onClick={() => navigateTo("team" as ViewType)} className="hover:text-white transition-colors">Team</button>
                </div>
            </div>
        </div>
      </footer>
    </div>
  )
}