"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  FileCheck,
  BadgeCheck,
  HeartHandshake,
  Globe,
  Lock,
  Database,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-md">
              <Database className="h-5 w-5" />
            </span>
            <span className="pops text-xl font-bold tracking-tight text-gray-900">EMPDATA</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/onboarding"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Get Started
            </Link>
            <Link
              href="/portal/auth"
              className="bg-white border border-gray-200 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md font-medium"
            >
              Portal Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          {/* <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 mr-2" />
            Welcome to the Future of Client Onboarding
          </div> */}

          {/* Main Heading */}
          <h1 className="pops text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-linear-to-r from-blue-800 via-indigo-690 to-blue-600 bg-clip-text text-transparent bg-300% animate-gradient">
              Seamless Secure
            </span>
            <br />
            <span className="text-gray-900">Client Onboarding Platform</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Experience a modern, secure, and intuitive platform for client
            registration, KYC verification, and employee data management.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/onboarding">
              <Button
                size="lg"
                className="group bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Client Onboarding
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/portal/auth">
              <Button
                size="lg"
                variant="outline"
                className="group border-2 border-blue-200 hover:border-blue-800 px-8 py-6 text-lg bg-white/50 backdrop-blur-sm"
              >
                <Building2 className="mr-2 h-5 w-5 text-blue-600" />
                Existing Client Login
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Lock className="h-4 w-4 text-blue-600 mr-2" />
              End-to-end encryption
            </div>
            <div className="flex items-center">
              <Globe className="h-4 w-4 text-blue-600 mr-2" />
              Secure cloud platform
            </div>
            <div className="flex items-center">
              <BadgeCheck className="h-4 w-4 text-blue-600 mr-2" />
              NIN/BVN verified
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { number: "10k+", label: "Active Users", icon: Users },
            { number: "500+", label: "Companies", icon: Building2 },
            { number: "50k+", label: "Verifications", icon: ShieldCheck },
            { number: "99.9%", label: "Success Rate", icon: CheckCircle2 },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center border border-blue-100 shadow-sm hover:shadow-md transition-all"
            >
              <stat.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-16 my-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="bg-linear-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent">
            Choose Your Client Onboarding Path
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Individual/Retail Card */}
          <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="h-2 bg-linear-to-r from-blue-800 to-indigo-900"></div>
            <div className="p-8">
              <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Individual/Retail</h3>
              <p className="text-gray-600 mb-6">
                Register for individual insurance policies with secure KYC
                verification and document upload.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Secure NIN/BVN encryption",
                  "Document upload support",
                  "Real-time verification",
                  "Instant confirmation",
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/onboarding?type=individual">
                <Button size={"lg"} className="w-full bg-blue-800 hover:bg-blue-900 text-white group-hover:shadow-lg transition-all">
                  Start Individual Onboarding
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Corporate Card */}
          <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="h-2 bg-linear-to-r from-emerald-500 to-blue-500"></div>
            <div className="p-8">
              <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Corporate</h3>
              <p className="text-gray-600 mb-6">
                Register as an employee under your company's group life
                insurance policy.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Company auto-complete",
                  "Beneficiary management",
                  "Group policy integration",
                  "Employer verification",
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-3 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/onboarding?type=corporate">
                <Button size={"lg"} className="w-full bg-linear-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white group-hover:shadow-lg transition-all">
                  Start Corporate Registration
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Corporate/Company Registration Note */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Representing a company?{" "}
            <Link
              href="/onboarding?type=corporate"
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              Register your company
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="bg-linear-to-r from-blue-300 to-indigo-600 bg-clip-text text-transparent">
            How It Works
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: FileCheck,
              title: "1. Submit Information",
              description:
                "Fill in your details and upload required documents securely.",
              color: "blue",
            },
            {
              icon: ShieldCheck,
              title: "2. Verification",
              description:
                "Your identity is verified through secure NIN/BVN checks.",
              color: "indigo",
            },
            {
              icon: HeartHandshake,
              title: "3. Confirmation",
              description:
                "Receive instant confirmation and access your dashboard.",
              color: "blue",
            },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-linear-to-r from-blue-300 to-indigo-300"></div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust EMPDATA for their insurance
            onboarding needs.
          </p>
          <Link href="/onboarding">
            <Button
              size="lg"
              className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg shadow-lg"
            >
              Start Your Onboarding Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              © 2026 Josbiz Technologies Limited
            </div>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 300%;
          animation: gradient 6s ease infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

/* ========================================================================== */
/* PENDED — previous local landing page design (commented out on purpose).    */
/* Kept here so it can be restored later: uncomment the block below and swap  */
/* the default export back to HomePageLocal.                                  */
/* ========================================================================== */

// "use client"
// 
// import Link from "next/link";
// import {
//   ArrowRight,
//   ArrowUpRight,
//   ShieldCheck,
//   Lock,
//   FileCheck,
//   Fingerprint,
//   Building2,
//   Users,
//   CheckCircle2,
//   Activity,
// } from "lucide-react";
// import Logo from "@/components/logo";
// import { ThemeToggle } from "@/components/theme-toggle";
// 
// /* ---------------------------------- bits ---------------------------------- */
// 
// function SectionLabel({ children }: { children: React.ReactNode }) {
//   return (
//     <p className="mb-4 flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.22em] text-brand-700/80 uppercase dark:text-brand-300/90">
//       <span className="h-px w-6 bg-brand-400/60" />
//       {children}
//     </p>
//   );
// }
// 
// function TickerItem({ label }: { label: string }) {
//   return (
//     <div className="flex shrink-0 items-center gap-10 pr-10">
//       <span className="text-xs font-medium tracking-[0.28em] whitespace-nowrap text-muted-foreground/70 dark:text-white/40">
//         {label}
//       </span>
//       <span className="h-1 w-1 rotate-45 bg-brand-400/60" />
//     </div>
//   );
// }
// 
// /* ------------------------------ hero mockup ------------------------------- */
// /* The mockup is an embedded product preview — it stays dark in both themes. */
// 
// function HeroMockup() {
//   const rows = [
//     { name: "Adaeze Okafor", meta: "NIN •••• 4821", status: "Verified", tone: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20" },
//     { name: "Tunde Bakare", meta: "BVN •••• 9034", status: "Verified", tone: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20" },
//     { name: "Kemi Adeyemi", meta: "NIN •••• 2210", status: "Pending", tone: "text-amber-300 bg-amber-400/10 border-amber-400/20" },
//   ];
// 
//   return (
//     <div className="relative">
//       {/* glow */}
//       <div className="absolute -inset-8 rounded-[40px] bg-brand-600/10 blur-3xl dark:bg-brand-500/10" />
// 
//       {/* main window */}
//       <div className="relative overflow-hidden rounded-2xl border border-border bg-[#0A1230]/95 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)] backdrop-blur dark:border-white/10 dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
//         {/* title bar */}
//         <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
//           <div className="flex gap-1.5">
//             <span className="size-2.5 rounded-full bg-white/15" />
//             <span className="size-2.5 rounded-full bg-white/15" />
//             <span className="size-2.5 rounded-full bg-white/15" />
//           </div>
//           <p className="ml-2 font-mono text-[11px] text-white/40">
//             empdata — admin console
//           </p>
//           <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
//             <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
//             LIVE
//           </span>
//         </div>
// 
//         <div className="flex">
//           {/* mini sidebar */}
//           <div className="flex w-12 flex-col items-center gap-4 border-r border-white/[0.06] py-4">
//             <span className="flex size-7 items-center justify-center rounded-lg bg-brand-500/20 text-brand-300">
//               <Activity className="size-3.5" />
//             </span>
//             {[Users, Building2, FileCheck, ShieldCheck].map((Icon, i) => (
//               <span key={i} className="text-white/25">
//                 <Icon className="size-3.5" />
//               </span>
//             ))}
//           </div>
// 
//           {/* content */}
//           <div className="min-w-0 flex-1 space-y-3 p-4">
//             {/* stat chips */}
//             <div className="grid grid-cols-3 gap-2">
//               {[
//                 { label: "Companies", value: "156" },
//                 { label: "Employees", value: "2,345" },
//                 { label: "Verified", value: "98%" },
//               ].map((s) => (
//                 <div
//                   key={s.label}
//                   className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2"
//                 >
//                   <p className="text-[9px] tracking-wider text-white/40 uppercase">
//                     {s.label}
//                   </p>
//                   <p className="font-display text-sm font-semibold text-white">
//                     {s.value}
//                   </p>
//                 </div>
//               ))}
//             </div>
// 
//             {/* chart */}
//             <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
//               <div className="mb-1 flex items-center justify-between">
//                 <p className="text-[9px] tracking-wider text-white/40 uppercase">
//                   Registrations — 12 months
//                 </p>
//                 <p className="text-[10px] font-medium text-emerald-300">+23.1%</p>
//               </div>
//               <svg viewBox="0 0 400 110" className="h-24 w-full" preserveAspectRatio="none">
//                 <defs>
//                   <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#7aa2ff" stopOpacity="0.35" />
//                     <stop offset="100%" stopColor="#7aa2ff" stopOpacity="0" />
//                   </linearGradient>
//                 </defs>
//                 {[22, 44, 66, 88].map((y) => (
//                   <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="white" strokeOpacity="0.05" />
//                 ))}
//                 <path
//                   d="M0,92 C40,86 60,70 90,72 C120,74 140,52 175,50 C210,48 230,58 260,44 C290,30 320,34 400,14 L400,110 L0,110 Z"
//                   fill="url(#heroFill)"
//                 />
//                 <path
//                   d="M0,92 C40,86 60,70 90,72 C120,74 140,52 175,50 C210,48 230,58 260,44 C290,30 320,34 400,14"
//                   fill="none"
//                   stroke="#8fb0ff"
//                   strokeWidth="2"
//                 />
//                 <path
//                   d="M0,98 C50,96 90,88 140,86 C190,84 240,74 300,66 C340,61 370,58 400,52"
//                   fill="none"
//                   stroke="#34d399"
//                   strokeOpacity="0.7"
//                   strokeWidth="1.5"
//                   strokeDasharray="3 4"
//                 />
//               </svg>
//             </div>
// 
//             {/* rows */}
//             {rows.map((row) => (
//               <div
//                 key={row.name}
//                 className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
//               >
//                 <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-500/15 font-display text-[10px] font-semibold text-brand-300">
//                   {row.name.split(" ").map((n) => n[0]).join("")}
//                 </span>
//                 <div className="min-w-0 flex-1">
//                   <p className="truncate text-[11px] font-medium text-white/80">
//                     {row.name}
//                   </p>
//                   <p className="font-mono text-[9px] text-white/35">{row.meta}</p>
//                 </div>
//                 <span className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${row.tone}`}>
//                   {row.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
// 
//       {/* floating card — verified toast */}
//       <div className="animate-float-slow absolute -top-6 -right-4 hidden items-center gap-3 rounded-xl border border-white/10 bg-[#0D1737]/95 px-4 py-3 shadow-2xl backdrop-blur md:flex">
//         <span className="flex size-9 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
//           <CheckCircle2 className="size-4.5" />
//         </span>
//         <div>
//           <p className="text-xs font-semibold text-white">Identity verified</p>
//           <p className="font-mono text-[10px] text-white/40">NIN check passed in 1.8s</p>
//         </div>
//       </div>
// 
//       {/* floating card — weekly stat */}
//       <div className="animate-float-slower absolute -bottom-6 -left-6 hidden rounded-xl border border-white/10 bg-[#0D1737]/95 px-4 py-3 shadow-2xl backdrop-blur md:block">
//         <p className="mb-2 text-[10px] tracking-wider text-white/40 uppercase">
//           Employees onboarded
//         </p>
//         <div className="flex items-end gap-3">
//           <p className="font-display text-xl font-semibold text-white">+128</p>
//           <div className="flex h-8 items-end gap-1">
//             {[5, 8, 6, 10, 7, 12, 14].map((h, i) => (
//               <span
//                 key={i}
//                 className="w-1.5 rounded-sm bg-brand-400/70"
//                 style={{ height: `${h * 5}px` }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// 
// /* --------------------------------- sections -------------------------------- */
// 
// const tickerItems = [
//   "NIN VERIFICATION",
//   "BVN MATCHING",
//   "CAC LOOKUP",
//   "DOCUMENT OCR",
//   "KYC AUDIT TRAIL",
//   "BENEFICIARY MANAGEMENT",
//   "NDPR COMPLIANT",
//   "AES-256 ENCRYPTION",
// ];
// 
// export default function HomePage() {
//   return (
//     <div className="min-h-screen overflow-hidden bg-background text-foreground antialiased dark:bg-[#060B1D] dark:text-white">
//       {/* backdrop */}
//       <div className="pointer-events-none absolute inset-0">
//         <div className="bg-grid-faint absolute inset-0 dark:bg-grid-faint-dark [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent)]" />
//         <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-brand-600/10 blur-[140px] dark:bg-brand-600/15" />
//       </div>
// 
//       {/* nav */}
//       <header className="relative z-10 border-b border-border/70 dark:border-white/[0.06]">
//         <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
//           <div className="flex items-center gap-3">
//             <Logo width={34} height={34} className="shadow-none" />
//             <span className="font-display text-base font-semibold tracking-tight text-navy-900 dark:text-white">
//               EMPDATA
//             </span>
//           </div>
//           <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex dark:text-white/60">
//             {[
//               { label: "Platform", href: "#platform" },
//               { label: "Verification", href: "#verification" },
//               { label: "How it works", href: "#process" },
//             ].map((l) => (
//               <a key={l.label} href={l.href} className="transition-colors hover:text-foreground dark:hover:text-white">
//                 {l.label}
//               </a>
//             ))}
//           </nav>
//           <div className="flex items-center gap-2">
//             <ThemeToggle />
//             <Link
//               href="/portal/auth"
//               className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground dark:text-white/70 dark:hover:text-white"
//             >
//               Portal Login
//             </Link>
//             <Link
//               href="/onboarding"
//               className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_oklch(0.49_0.19_262/0.3)] transition-colors hover:bg-brand-500"
//             >
//               Get Started
//             </Link>
//           </div>
//         </div>
//       </header>
// 
//       {/* hero */}
//       <section className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-28 lg:pt-28">
//         <div className="grid items-center gap-16 lg:grid-cols-12">
//           <div className="lg:col-span-6">
//             <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-border bg-muted/60 py-1.5 pr-4 pl-2 text-xs text-muted-foreground dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70">
//               <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
//                 <span className="size-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
//                 LIVE
//               </span>
//               NIN &amp; BVN verification in seconds
//             </div>
// 
//             <h1 className="font-display text-[44px] leading-[1.05] font-semibold tracking-tight text-navy-900 sm:text-6xl dark:text-white">
//               Insurance onboarding,
//               <br />
//               <span className="font-serif text-[1.12em] font-normal text-brand-600 italic dark:text-brand-300">
//                 without the paperwork.
//               </span>
//             </h1>
// 
//             <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground dark:text-white/55">
//               Register clients, verify identities against NIN, BVN and CAC
//               records, and manage group life policies — from one secure,
//               audit-ready console.
//             </p>
// 
//             <div className="mt-9 flex flex-wrap items-center gap-4">
//               <Link
//                 href="/onboarding"
//                 className="group inline-flex h-12 items-center gap-2 rounded-lg bg-brand-600 px-7 text-sm font-semibold text-white shadow-[0_0_32px_oklch(0.49_0.19_262/0.35)] transition-all hover:bg-brand-500"
//               >
//                 Start onboarding
//                 <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
//               </Link>
//               <a
//                 href="#platform"
//                 className="group inline-flex h-12 items-center gap-2 rounded-lg border border-border px-7 text-sm font-medium text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground dark:border-white/10 dark:text-white/75 dark:hover:border-white/25 dark:hover:text-white"
//               >
//                 See the platform
//                 <ArrowUpRight className="size-4 text-muted-foreground/60 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground dark:text-white/40 dark:group-hover:text-white" />
//               </a>
//             </div>
// 
//             <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-muted-foreground/80 dark:text-white/40">
//               <span className="flex items-center gap-2">
//                 <Lock className="size-3.5 text-brand-600 dark:text-brand-400" /> End-to-end encryption
//               </span>
//               <span className="flex items-center gap-2">
//                 <Fingerprint className="size-3.5 text-brand-600 dark:text-brand-400" /> NIN / BVN verified
//               </span>
//               <span className="flex items-center gap-2">
//                 <ShieldCheck className="size-3.5 text-brand-600 dark:text-brand-400" /> NDPR compliant
//               </span>
//             </div>
//           </div>
// 
//           <div className="lg:col-span-6">
//             <HeroMockup />
//           </div>
//         </div>
//       </section>
// 
//       {/* ticker */}
//       <div className="relative z-10 overflow-hidden border-y border-border/70 py-5 dark:border-white/[0.06]">
//         <div className="animate-marquee flex w-max">
//           {[...tickerItems, ...tickerItems].map((item, i) => (
//             <TickerItem key={i} label={item} />
//           ))}
//         </div>
//       </div>
// 
//       {/* paths */}
//       <section id="platform" className="relative z-10 mx-auto max-w-7xl px-6 py-28">
//         <div className="mb-16 max-w-2xl">
//           <SectionLabel>Onboarding paths</SectionLabel>
//           <h2 className="font-display text-4xl font-semibold tracking-tight text-navy-900 sm:text-5xl dark:text-white">
//             Two paths.{" "}
//             <span className="font-serif text-brand-600 italic dark:text-brand-300">One platform.</span>
//           </h2>
//         </div>
// 
//         <div className="border-t border-border dark:border-white/[0.08]">
//           {/* individual */}
//           <Link
//             href="/onboarding?type=individual"
//             className="group grid items-center gap-6 border-b border-border py-10 transition-colors hover:bg-muted/50 md:grid-cols-12 md:gap-8 dark:border-white/[0.08] dark:hover:bg-white/[0.02]"
//           >
//             <span className="font-serif text-2xl text-muted-foreground/40 italic md:col-span-1 dark:text-white/25">
//               01
//             </span>
//             <div className="md:col-span-4">
//               <h3 className="font-display text-2xl font-semibold text-foreground dark:text-white">Individual</h3>
//               <p className="mt-2 text-sm leading-relaxed text-muted-foreground dark:text-white/50">
//                 Personal insurance registration with secure KYC, document upload
//                 and real-time verification.
//               </p>
//             </div>
//             <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground/80 md:col-span-5 dark:text-white/45">
//               {["NIN/BVN encryption", "Document upload", "Instant confirmation"].map(
//                 (f) => (
//                   <li key={f} className="flex items-center gap-2">
//                     <span className="h-1 w-1 rounded-full bg-brand-500 dark:bg-brand-400" />
//                     {f}
//                   </li>
//                 ),
//               )}
//             </ul>
//             <span className="flex size-11 items-center justify-center justify-self-start rounded-full border border-border text-muted-foreground transition-all group-hover:border-brand-400 group-hover:bg-brand-500/10 group-hover:text-brand-600 md:col-span-2 md:justify-self-end dark:border-white/10 dark:text-white/50 dark:group-hover:border-brand-400 dark:group-hover:text-brand-300">
//               <ArrowUpRight className="size-4.5" />
//             </span>
//           </Link>
// 
//           {/* corporate */}
//           <Link
//             href="/onboarding?type=corporate"
//             className="group grid items-center gap-6 border-b border-border py-10 transition-colors hover:bg-muted/50 md:grid-cols-12 md:gap-8 dark:border-white/[0.08] dark:hover:bg-white/[0.02]"
//           >
//             <span className="font-serif text-2xl text-muted-foreground/40 italic md:col-span-1 dark:text-white/25">
//               02
//             </span>
//             <div className="md:col-span-4">
//               <div className="flex items-center gap-3">
//                 <h3 className="font-display text-2xl font-semibold text-foreground dark:text-white">Corporate</h3>
//                 <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-700 uppercase dark:bg-emerald-400/10 dark:text-emerald-300">
//                   Popular
//                 </span>
//               </div>
//               <p className="mt-2 text-sm leading-relaxed text-muted-foreground dark:text-white/50">
//                 Group life registration for companies — employees, beneficiaries
//                 and employer verification in one flow.
//               </p>
//             </div>
//             <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground/80 md:col-span-5 dark:text-white/45">
//               {["Company auto-complete", "Beneficiary management", "Group policy sync"].map(
//                 (f) => (
//                   <li key={f} className="flex items-center gap-2">
//                     <span className="h-1 w-1 rounded-full bg-emerald-500 dark:bg-emerald-400" />
//                     {f}
//                   </li>
//                 ),
//               )}
//             </ul>
//             <span className="flex size-11 items-center justify-center justify-self-start rounded-full border border-border text-muted-foreground transition-all group-hover:border-emerald-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-600 md:col-span-2 md:justify-self-end dark:border-white/10 dark:text-white/50 dark:group-hover:border-emerald-400 dark:group-hover:text-emerald-300">
//               <ArrowUpRight className="size-4.5" />
//             </span>
//           </Link>
//         </div>
//       </section>
// 
//       {/* bento */}
//       <section id="verification" className="relative z-10 mx-auto max-w-7xl px-6 pb-28">
//         <div className="mb-16 max-w-2xl">
//           <SectionLabel>The engine</SectionLabel>
//           <h2 className="font-display text-4xl font-semibold tracking-tight text-navy-900 sm:text-5xl dark:text-white">
//             Built for{" "}
//             <span className="font-serif text-brand-600 italic dark:text-brand-300">compliance teams</span>
//           </h2>
//         </div>
// 
//         <div className="grid gap-4 md:grid-cols-6">
//           {/* verification log — embedded product visual, stays dark */}
//           <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-7 md:col-span-4 dark:border-white/[0.08] dark:bg-white/[0.025]">
//             <div className="mb-6 flex items-center justify-between">
//               <h3 className="font-display text-lg font-semibold text-foreground dark:text-white">
//                 Real-time verification
//               </h3>
//               <span className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
//                 <span className="size-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
//                 STREAMING
//               </span>
//             </div>
//             <div className="space-y-2.5 rounded-xl bg-[#0A1230] p-3 font-mono text-xs">
//               {[
//                 { check: "NIN", who: "Adaeze Okafor •••• 4821", ok: true, ms: "1.8s" },
//                 { check: "BVN", who: "Tunde Bakare •••• 9034", ok: true, ms: "2.1s" },
//                 { check: "CAC", who: "Meridian Logistics Ltd", ok: true, ms: "3.4s" },
//                 { check: "DOC", who: "passport_scan.pdf", ok: false, ms: "review" },
//               ].map((row, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.03] px-3.5 py-2.5"
//                 >
//                   <span className="w-9 shrink-0 font-semibold text-brand-300">
//                     {row.check}
//                   </span>
//                   <span className="min-w-0 flex-1 truncate text-white/55">{row.who}</span>
//                   <span className={row.ok ? "text-emerald-300" : "text-amber-300"}>
//                     {row.ok ? "MATCH" : "QUEUED"}
//                   </span>
//                   <span className="text-white/30">{row.ms}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
// 
//           {/* approval ring */}
//           <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-7 text-center md:col-span-2 dark:border-white/[0.08] dark:bg-white/[0.025]">
//             <div className="relative mb-4">
//               <svg viewBox="0 0 90 90" className="size-28 -rotate-90">
//                 <circle cx="45" cy="45" r="38" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="7" />
//                 <circle
//                   cx="45" cy="45" r="38" fill="none" stroke="#6f9bff" strokeWidth="7"
//                   strokeLinecap="round" strokeDasharray="238.7" strokeDashoffset="4.8"
//                 />
//               </svg>
//               <span className="font-display absolute inset-0 flex items-center justify-center text-xl font-semibold text-foreground dark:text-white">
//                 98%
//               </span>
//             </div>
//             <h3 className="font-display text-base font-semibold text-foreground dark:text-white">Auto-approval rate</h3>
//             <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground dark:text-white/45">
//               Of registrations clear verification without manual review.
//             </p>
//           </div>
// 
//           {/* security */}
//           <div className="rounded-2xl border border-border bg-card p-7 md:col-span-2 dark:border-white/[0.08] dark:bg-white/[0.025]">
//             <span className="animate-pulse-ring mb-5 flex size-11 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-brand-700 dark:border-brand-400/30 dark:bg-brand-500/15 dark:text-brand-300">
//               <Lock className="size-5" />
//             </span>
//             <h3 className="font-display text-base font-semibold text-foreground dark:text-white">Bank-grade security</h3>
//             <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground dark:text-white/45">
//               AES-256 at rest, TLS 1.3 in transit, field-level encryption for
//               national identity numbers.
//             </p>
//           </div>
// 
//           {/* volume */}
//           <div className="rounded-2xl border border-border bg-card p-7 md:col-span-2 dark:border-white/[0.08] dark:bg-white/[0.025]">
//             <p className="font-display text-3xl font-semibold text-foreground dark:text-white">50k+</p>
//             <p className="mt-1 text-[11px] tracking-wider text-muted-foreground uppercase dark:text-white/40">
//               Verifications processed
//             </p>
//             <div className="mt-5 flex h-12 items-end gap-1">
//               {[6, 9, 7, 12, 10, 15, 13, 18, 16, 22].map((h, i) => (
//                 <span
//                   key={i}
//                   className={`flex-1 rounded-sm ${i > 6 ? "bg-brand-500 dark:bg-brand-400" : "bg-brand-500/30 dark:bg-brand-400/30"}`}
//                   style={{ height: `${h * 4}px` }}
//                 />
//               ))}
//             </div>
//           </div>
// 
//           {/* beneficiaries */}
//           <div className="rounded-2xl border border-border bg-card p-7 md:col-span-2 dark:border-white/[0.08] dark:bg-white/[0.025]">
//             <div className="mb-5 flex">
//               {["AO", "TB", "KA", "+9"].map((t, i) => (
//                 <span
//                   key={i}
//                   className={`flex size-9 items-center justify-center rounded-full border-2 font-display text-[10px] font-semibold ${
//                     i === 3
//                       ? "border-background bg-brand-500/15 text-brand-700 dark:border-[#0A1230] dark:bg-brand-500/20 dark:text-brand-300"
//                       : "border-background bg-brand-500/25 text-foreground dark:border-[#0A1230] dark:bg-brand-500/40 dark:text-white"
//                   } ${i > 0 ? "-ml-2.5" : ""}`}
//                 >
//                   {t}
//                 </span>
//               ))}
//             </div>
//             <h3 className="font-display text-base font-semibold text-foreground dark:text-white">Beneficiary management</h3>
//             <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground dark:text-white/45">
//               Employees nominate and update beneficiaries with full audit history.
//             </p>
//           </div>
//         </div>
//       </section>
// 
//       {/* process */}
//       <section id="process" className="relative z-10 mx-auto max-w-7xl px-6 pb-28">
//         <div className="mb-16 max-w-2xl">
//           <SectionLabel>The process</SectionLabel>
//           <h2 className="font-display text-4xl font-semibold tracking-tight text-navy-900 sm:text-5xl dark:text-white">
//             Live in{" "}
//             <span className="font-serif text-brand-600 italic dark:text-brand-300">three steps</span>
//           </h2>
//         </div>
// 
//         <div className="grid gap-10 md:grid-cols-3">
//           {[
//             {
//               n: "01",
//               title: "Submit",
//               desc: "Clients fill in their details and upload documents through a guided, mobile-first flow.",
//             },
//             {
//               n: "02",
//               title: "Verify",
//               desc: "Identities are checked against NIN, BVN and CAC records automatically — most in seconds.",
//             },
//             {
//               n: "03",
//               title: "Confirm",
//               desc: "Approvals, invitations and policy sync happen instantly, with a complete audit trail.",
//             },
//           ].map((step, i) => (
//             <div key={step.n} className="relative">
//               <div className="mb-6 flex items-center gap-4">
//                 <span className="font-serif text-5xl text-brand-600/70 italic dark:text-brand-400/80">
//                   {step.n}
//                 </span>
//                 {i < 2 && (
//                   <span className="hidden h-px flex-1 bg-border md:block dark:bg-white/[0.08]" />
//                 )}
//               </div>
//               <h3 className="font-display text-xl font-semibold text-foreground dark:text-white">{step.title}</h3>
//               <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground dark:text-white/50">
//                 {step.desc}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>
// 
//       {/* stats band */}
//       <section className="relative z-10 border-y border-border/70 dark:border-white/[0.06]">
//         <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px md:grid-cols-4">
//           {[
//             { value: "10k+", label: "Active users" },
//             { value: "500+", label: "Companies" },
//             { value: "50k+", label: "Verifications" },
//             { value: "99.9%", label: "Uptime" },
//           ].map((stat) => (
//             <div key={stat.label} className="px-6 py-12 text-center">
//               <p className="font-display text-4xl font-semibold tracking-tight text-foreground dark:text-white">
//                 {stat.value}
//               </p>
//               <p className="mt-2 text-[11px] tracking-[0.2em] text-muted-foreground uppercase dark:text-white/40">
//                 {stat.label}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>
// 
//       {/* CTA */}
//       <section className="relative z-10 mx-auto max-w-7xl px-6 py-32 text-center">
//         <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-[300px] max-w-2xl -translate-y-1/2 rounded-full bg-brand-600/10 blur-[120px] dark:bg-brand-600/15" />
//         <p className="font-serif mb-6 text-2xl text-brand-600 italic dark:text-brand-300">
//           Ready when you are.
//         </p>
//         <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold tracking-tight text-navy-900 sm:text-6xl dark:text-white">
//           Onboard your first client in minutes.
//         </h2>
//         <div className="mt-10 flex flex-wrap justify-center gap-4">
//           <Link
//             href="/onboarding"
//             className="group inline-flex h-13 items-center gap-2 rounded-lg bg-brand-600 px-8 text-sm font-semibold text-white shadow-[0_0_40px_oklch(0.49_0.19_262/0.4)] transition-all hover:bg-brand-500"
//           >
//             Start onboarding
//             <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
//           </Link>
//           <Link
//             href="/portal/auth"
//             className="inline-flex h-13 items-center gap-2 rounded-lg border border-border px-8 text-sm font-medium text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground dark:border-white/10 dark:text-white/75 dark:hover:border-white/25 dark:hover:text-white"
//           >
//             <Building2 className="size-4 text-muted-foreground/60 dark:text-white/40" />
//             Client login
//           </Link>
//         </div>
//       </section>
// 
//       {/* footer */}
//       <footer className="relative z-10 border-t border-border/70 dark:border-white/[0.06]">
//         <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
//           <div className="flex items-center gap-3">
//             <Logo width={28} height={28} className="shadow-none" />
//             <span className="font-display text-sm font-semibold text-foreground dark:text-white">EMPDATA</span>
//             <span className="ml-3 text-xs text-muted-foreground dark:text-white/30">
//               © 2024 SCIB. All rights reserved.
//             </span>
//           </div>
//           <div className="flex gap-8 text-xs text-muted-foreground dark:text-white/40">
//             {["Privacy", "Terms", "Contact"].map((l) => (
//               <a key={l} href="#" className="transition-colors hover:text-foreground dark:hover:text-white">
//                 {l}
//               </a>
//             ))}
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
// 