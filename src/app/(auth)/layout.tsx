"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Fingerprint,
  Lock,
  ArrowRight,
} from "lucide-react";
import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const assurances = [
  {
    icon: Fingerprint,
    title: "NIN / BVN verified",
    desc: "Identity checks against national registries in seconds.",
  },
  {
    icon: Lock,
    title: "Encrypted end-to-end",
    desc: "AES-256 at rest, TLS 1.3 in transit, field-level protection.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-ready",
    desc: "Every action is logged and exportable for compliance.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand panel (always dark; this is the brand moment) */}
      <aside className="relative hidden overflow-hidden bg-navy-950 text-white lg:flex lg:flex-col">
        <div className="bg-grid-faint-dark absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_20%,black,transparent)]" />
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-brand-600/20 blur-[110px]" />
        <div className="absolute right-0 bottom-0 size-80 rounded-full bg-brand-500/10 blur-[100px]" />

        <div className="relative z-10 flex h-full flex-col p-12">
          <Link href="/" className="flex w-fit items-center gap-3">
            <Logo width={36} height={36} className="shadow-none" />
            <span className="font-display text-lg font-semibold tracking-tight">
              EMPDATA
            </span>
          </Link>

          <div className="mt-auto space-y-10">
            <h2 className="max-w-md font-display text-4xl leading-tight font-semibold tracking-tight">
              Insurance operations,
              <br />
              <span className="font-serif text-brand-300 italic">
                perfectly streamlined.
              </span>
            </h2>

            <ul className="space-y-5">
              {assurances.map((item) => (
                <li key={item.title} className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-brand-300">
                    <item.icon className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-sm text-white/50">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Testimonial — hidden for now, re-enable later
            <figure className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <blockquote className="font-serif text-lg leading-snug text-white/85 italic">
                "What used to take our team days of back-and-forth now
                finishes before lunch."
              </blockquote>
              <figcaption className="mt-3 flex items-center gap-2.5 text-xs text-white/40">
                <span className="size-6 rounded-full bg-gradient-to-br from-brand-300 to-brand-600" />
                Operations Lead · HMO partner, Lagos
              </figcaption>
            </figure>
            */}

            <div className="flex items-center gap-2 border-t border-white/10 pt-6 text-xs text-white/40">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              Built for insurers, brokers and HMOs across Nigeria
            </div>
          </div>
        </div>
      </aside>

      {/* Right — form stage (theme adaptive) */}
      <main className="relative flex flex-col overflow-hidden bg-muted/40 dark:bg-[#131F45]">
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-grid-faint absolute inset-0 dark:bg-grid-faint-dark [mask-image:radial-gradient(ellipse_70%_40%_at_50%_0%,black,transparent)]" />
          <div className="absolute -top-32 right-[-8%] size-[26rem] rounded-full bg-brand-400/15 blur-[110px] dark:bg-brand-600/20" />
          <div className="absolute bottom-[-15%] left-[-8%] size-[22rem] rounded-full bg-brand-300/15 blur-[100px] dark:bg-brand-500/10" />
        </div>

        <div className="relative z-10 flex items-center justify-between px-6 py-5 lg:justify-end">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <Logo width={30} height={30} className="shadow-none" />
            <span className="font-display text-sm font-semibold">EMPDATA</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/onboarding"
              className="group hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex dark:text-white/60 dark:hover:text-white"
            >
              New client onboarding
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <footer className="relative z-10 pb-6 text-center text-xs text-muted-foreground/60 dark:text-white/25">
          © {new Date().getFullYear()} EMPDATA · Secure client onboarding for
          insurers
        </footer>
      </main>
    </div>
  );
}
