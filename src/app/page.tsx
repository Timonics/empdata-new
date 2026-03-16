// import { redirect } from "next/navigation";

// export default function AuthIndexPage() {
//   redirect("/admin/login");
// }

"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  FileCheck,
  Clock,
  BadgeCheck,
  HeartHandshake,
  Zap,
  Globe,
  Lock,
} from "lucide-react";
import Logo from "@/components/logo";

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
          <Logo />
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
            <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent bg-300% animate-gradient">
              Seamless Onboarding
            </span>
            <br />
            <span className="text-gray-900">for Insurance & Group Life</span>
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
                Start Onboarding Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/portal/auth">
              <Button
                size="lg"
                variant="outline"
                className="group border-2 border-blue-200 hover:border-blue-600 px-8 py-6 text-lg bg-white/50 backdrop-blur-sm"
              >
                <Building2 className="mr-2 h-5 w-5 text-blue-600" />
                Company Portal
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
      <section className="relative z-10 container mx-auto px-6 py-16">
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
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Choose Your Onboarding Path
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Individual Insurance Card */}
          <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="h-2 bg-linear-to-r from-blue-600 to-indigo-600"></div>
            <div className="p-8">
              <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Individual Insurance</h3>
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
                <Button size={"lg"} className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:shadow-lg transition-all">
                  Start Individual Onboarding
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Employee Group Life Card */}
          <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 relative">
            <div className="absolute top-4 right-4">
              <span className="bg-linear-to-r from-emerald-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Popular
              </span>
            </div>
            <div className="h-2 bg-linear-to-r from-emerald-500 to-blue-500"></div>
            <div className="p-8">
              <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Employee Group Life</h3>
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
              <Link href="/onboarding?type=employee-group-life">
                <Button size={"lg"} className="w-full bg-linear-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white group-hover:shadow-lg transition-all">
                  Start Employee Registration
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

      {/* Benefits */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <div className="bg-linear-to-br from-blue-500 to-indigo-500 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose SCIB?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Complete onboarding in minutes, not hours.",
              },
              {
                icon: Lock,
                title: "Bank-Grade Security",
                description: "End-to-end encryption for all sensitive data.",
              },
              {
                icon: BadgeCheck,
                title: "Verified & Compliant",
                description: "Full compliance with regulatory requirements.",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <benefit.icon className="h-8 w-8 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-blue-100">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust SCIB for their insurance
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
              © 2024 SCIB Client Onboarding Platform. All rights reserved.
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
