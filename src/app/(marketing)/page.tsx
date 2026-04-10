"use client"

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap, Shield, BarChart3, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full text-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 pt-20">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-slate-200 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Now with Global Multi-Currency Support</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900">
              Smart Billing <br /> 
              <span className="text-primary italic">Simplified.</span>
            </h1>
            
            <p className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed">
              Adrinix is the next-generation billing platform for modern enterprises. 
              Invoice faster, track easier, and scale globally with one unified system.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="h-16 px-10 rounded-2xl premium-gradient text-white text-lg font-black shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                <Link href="/dashboard" className="flex items-center gap-2">
                  Get Started for Free <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-bold border-2 border-slate-200 hover:bg-white hover:text-primary transition-all">
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-6">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-12 w-12 rounded-full border-4 border-slate-50 overflow-hidden bg-slate-200">
                    <div className="w-full h-full premium-gradient opacity-20" />
                  </div>
                ))}
                <div className="h-12 w-12 rounded-full border-4 border-slate-50 bg-white shadow-sm flex items-center justify-center font-bold text-xs">
                  +2k
                </div>
              </div>
              <p className="text-sm text-slate-400 font-bold">Joined by over 2,000+ <br/>global companies</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card rounded-[3rem] p-4 relative z-10 bg-white/40 border-white/40 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]">
              <div className="relative rounded-[2rem] overflow-hidden bg-white aspect-[4/3] flex items-center justify-center p-12">
                <Image 
                  src="/logo.png" 
                  alt="Adrinix Dashboard Preview" 
                  width={600}
                  height={600}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 glass-card p-6 rounded-3xl z-20 shadow-xl border-white/60"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Zap className="text-white h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                  <p className="text-lg font-black text-slate-900">+42.5%</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 glass-card p-6 rounded-3xl z-20 shadow-xl border-white/60"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <Globe className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global</p>
                  <p className="text-lg font-black text-slate-900">Anywhere</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <h2 className="text-primary font-black uppercase tracking-[0.3em] text-sm">Main Features</h2>
            <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900">
              Built for the <br/> decentralized age.
            </h3>
            <p className="text-slate-500 text-lg font-medium">
              Everything you need to manage your business financials in one beautiful interface.
              No complex setups, just smart automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Lightning Fast POS", desc: "Process transactions in milliseconds with our high-performance point of sale system." },
              { icon: Shield, title: "Secure Data", desc: "Enterprise-grade encryption and secure access controls for all your business data." },
              { icon: BarChart3, title: "Deep Analytics", desc: "Gain actionable insights with our comprehensive dashboard and reporting tools." },
              { icon: CheckCircle2, title: "Smart Invoicing", desc: "Automate invoice generation and delivery with personalized templates." },
              { icon: Users, title: "CRM Integration", desc: "Manage client relationships seamlessly with built-in customer tracking." },
              { icon: Globe, title: "Cloud Native", desc: "Access your billing system from anywhere in the world on any device." },
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 hover:bg-white hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-transparent hover:border-slate-100 group">
                <div className="h-16 w-16 premium-gradient rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/10 group-hover:rotate-6 transition-transform">
                  <f.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{f.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto rounded-[4rem] premium-gradient p-16 md:p-24 text-center space-y-10 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] shadow-primary/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-48 -mb-48 blur-3xl" />
          
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter max-w-4xl mx-auto leading-none">
            Ready to experience the Adrinix difference?
          </h2>
          <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Join thousands of businesses streamlining their checkout and billing processes with Adrinix. 
            Smart billing is just a click away.
          </p>
          <div className="pt-6">
            <Button asChild size="lg" className="h-20 px-12 rounded-[2rem] bg-white text-primary text-xl font-black hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-2xl">
              <Link href="/dashboard" className="flex items-center gap-3">
                Build Your Dashboard <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
