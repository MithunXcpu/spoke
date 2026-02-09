"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  Cpu,
  Rocket,
  Zap,
  Shield,
  Clock,
  Code2,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const stats = [
  { value: "60s", label: "Average build time" },
  { value: "500+", label: "Tools generated" },
  { value: "$0", label: "Infrastructure cost" },
  { value: "99%", label: "Accuracy rate" },
];

const features = [
  {
    icon: Camera,
    title: "Instant Capture",
    description:
      "Paste any screenshot from a spreadsheet, CRM, or dashboard. Our vision AI extracts every data point automatically.",
  },
  {
    icon: Cpu,
    title: "AI-Powered Generation",
    description:
      "Anthropic Claude analyzes your screenshot and description to generate a fully functional, interactive tool in seconds.",
  },
  {
    icon: Code2,
    title: "Production-Ready Code",
    description:
      "Every generated tool uses clean React components with proper TypeScript types. Export, embed, or deploy anywhere.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your screenshots and data never leave the session. No storage, no training, no third-party sharing.",
  },
  {
    icon: Layers,
    title: "Any Data Source",
    description:
      "Works with spreadsheets, Notion tables, Airtable views, CRM dashboards, or any structured data you can screenshot.",
  },
  {
    icon: BarChart3,
    title: "Smart Formatting",
    description:
      "Auto-detects charts, tables, forms, and dashboards. Generates the right component type for your data.",
  },
];

const steps = [
  {
    step: "01",
    icon: Camera,
    title: "Screenshot",
    description: "Capture any UI, spreadsheet, or data view and paste it directly into Spoke.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "AI Analysis",
    description: "Claude vision extracts structure, data, and intent from your screenshot in seconds.",
  },
  {
    step: "03",
    icon: Rocket,
    title: "Working Tool",
    description: "Get a fully interactive dashboard, tracker, or calculator ready to use and share.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Spoke</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-surface-raised hover:bg-surface-overlay border border-border rounded-lg text-sm transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-8 inline-flex">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface-raised/50 text-sm text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Powered by Claude Vision AI
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8"
            >
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-[gradient_6s_ease_infinite] bg-[length:200%_auto]">
                Screenshot it.
              </span>
              <br />
              <span className="text-foreground">Build it.</span>
              <br />
              <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent animate-[gradient_6s_ease_infinite] bg-[length:200%_auto]">
                Ship it.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Stop paying for SaaS tools you barely use. Paste a screenshot
              of any UI, describe what you need, and get a working tool
              in 60 seconds.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <Link
                href="/build"
                className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-lg font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                Build Your First Tool
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 border border-border hover:border-muted rounded-full text-lg font-semibold text-muted-foreground hover:text-foreground transition-all hover:-translate-y-0.5"
              >
                Watch Demo
              </Link>
            </motion.div>

            {/* Micro trust */}
            <motion.p
              variants={fadeUp}
              className="text-sm text-muted flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-primary" />
              No signup required to start building
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="relative z-10 px-6 pb-24"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                className="text-center p-6 rounded-2xl bg-surface/60 border border-border-subtle"
              >
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="relative z-10 px-6 py-24 border-t border-border-subtle"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three steps. Sixty seconds. One working tool.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.step} variants={fadeUp} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                )}
                <div className="relative group">
                  <div className="p-8 rounded-2xl bg-surface border border-border-subtle hover:border-primary/30 transition-all duration-300">
                    {/* Step number */}
                    <span className="text-xs font-mono text-primary/60 tracking-widest uppercase mb-4 block">
                      Step {step.step}
                    </span>
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-primary-muted flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="relative z-10 px-6 py-24 border-t border-border-subtle"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Built for Speed
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Everything you need to go from idea to working tool, without the overhead.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={scaleIn}
                className="group relative p-6 rounded-2xl bg-surface border border-border-subtle hover:border-primary/30 transition-all duration-300"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary-muted flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:shadow-lg group-hover:shadow-glow transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-32 border-t border-border-subtle">
        {/* CTA glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/8 blur-3xl" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to build
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {" "}something?
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto"
          >
            No credit card. No signup. Just paste a screenshot and describe
            what you need.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              href="/build"
              className="group inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-primary to-secondary rounded-full text-lg font-semibold text-white shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary/70" />
              60s average build
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-primary/70" />
              Privacy first
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-primary/70" />
              Free to start
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold">Spoke</span>
          </div>
          <p className="text-sm text-muted">
            Built by Mithun Manjunatha
          </p>
          <div className="flex items-center gap-6 text-sm text-muted">
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/demo" className="hover:text-foreground transition-colors">
              Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
