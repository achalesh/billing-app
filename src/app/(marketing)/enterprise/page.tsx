"use client"

import { motion } from "framer-motion";
import { Shield, Zap, Globe, Users, Server, Lock, Code, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const enterpriseFeatures = [
  {
    icon: Lock,
    title: "Enterprise SSO",
    desc: "Seamlessly integrate with Okta, Azure AD, and Google Workspace for secure, centralized access."
  },
  {
    icon: Server,
    title: "Regional Data Residency",
    desc: "Compliance with local laws by choosing where your data lives—perfect for multinational compliance."
  },
  {
    icon: Code,
    title: "Unlimited Custom APIs",
    desc: "Connect your existing ERP and CRM systems with bespoke API endpoints and webhooks."
  },
  {
    icon: Globe,
    title: "Multi-Entity Management",
    desc: "Manage multiple brands, subsidiaries, and international offices from a single glass-pane dashboard."
  },
  {
    icon: BarChart3,
    title: "Custom Reporting",
    desc: "Build proprietary data models and export complex financial reports tailored to your CFO's needs."
  },
  {
    icon: Users,
    title: "Advanced RBAC",
    desc: "Granular Role-Based Access Control to ensure every staff member has exactly the access they need."
  }
];

export default function EnterprisePage() {
  return (
    <div className="flex flex-col w-full bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              Adrinix for Enterprise
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-slate-900 mb-8">
              Billion-Dollar <br />
              <span className="text-gradient">Reliability.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
              Power your global operations with the world's most flexible billing engine. 
              Built for high-volume transactions, advanced compliance, and extreme customization.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 pt-8"
          >
            <Button asChild size="lg" className="h-16 px-10 rounded-2xl premium-gradient text-white text-lg font-black shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Link href="mailto:enterprise@adrinix.com">Contact Sales</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-bold border-2 border-slate-200 hover:bg-white hover:text-primary transition-all">
              <Link href="#solutions">View Solutions</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mb-10">Trusted by Global Innovators</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale items-center">
            {/* Logo Placeholders with text representing brand strength */}
            <span className="text-2xl font-black tracking-tighter">GLOBAL BANK</span>
            <span className="text-2xl font-black tracking-tighter">TECH CORP</span>
            <span className="text-2xl font-black tracking-tighter">LOGISTICS PRO</span>
            <span className="text-2xl font-black tracking-tighter">FINTECH+</span>
            <span className="text-2xl font-black tracking-tighter">RETAIL GIANT</span>
          </div>
        </div>
      </section>

      {/* Enterprise Features Grid */}
      <section id="solutions" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 italic">Built for the Fortune 500</h2>
            <p className="text-slate-500 text-lg font-medium">
              We provide the core financial infrastructure that allows your team to focus on growth, not compliance and scaling issues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {enterpriseFeatures.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-900/5 hover:scale-[1.03] transition-all duration-500 group"
              >
                <div className="h-16 w-16 premium-gradient rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/10 group-hover:-rotate-3 transition-transform">
                  <f.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{f.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto rounded-[4rem] dark-gradient p-16 md:p-32 text-center space-y-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            {/* Background design pattern */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] border-l border-b border-white/20 rounded-bl-[10rem]" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter max-w-4xl mx-auto leading-none">
            Does your infrastructure <br />
            <span className="italic">move as fast</span> as you?
          </h2>
          <p className="text-white/60 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Stop worrying about transaction limits and integration bottlenecks. Scale your billing with Adrinix Enterprise.
          </p>
          <div className="pt-8">
            <Button asChild size="lg" className="h-20 px-12 rounded-[2.5rem] bg-white text-slate-900 text-xl font-black hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-2xl">
              <Link href="mailto:enterprise@adrinix.com" className="flex items-center gap-3">
                Talk to an Expert <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
