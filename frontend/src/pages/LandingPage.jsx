import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  Monitor,
  Server,
  Cpu,
  Cloud,
  Smartphone,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/* ─────────────────────────────────────────────
   Bento Card Sub-component
───────────────────────────────────────────── */
function BentoCard({ icon, title, desc, className, glowClass }) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-lg flex flex-col justify-between',
        className,
      )}
    >
      {/* Gradient accent overlay */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity duration-300 group-hover:opacity-60',
          glowClass,
        )}
      />

      {/* Icon */}
      <div className="relative z-10 size-11 rounded-xl border border-border/50 bg-muted flex items-center justify-center text-muted-foreground transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20">
        {icon}
      </div>

      {/* Text */}
      <div className="relative z-10 mt-4">
        <h3 className="font-semibold text-foreground text-lg mb-1.5 leading-snug">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Process Step
───────────────────────────────────────────── */
function ProcessStep({ step, title, desc, isLast }) {
  return (
    <div className="relative flex flex-col items-center text-center gap-5">
      {/* Connector line — between cards on desktop */}
      {!isLast && (
        <div className="hidden md:block absolute top-9 left-[calc(50%+2.5rem)] right-0 h-px bg-gradient-to-r from-border via-primary/30 to-transparent" />
      )}

      {/* Step bubble */}
      <div className="relative z-10 flex size-[4.5rem] items-center justify-center rounded-full border-2 border-border bg-background shadow-sm">
        <span className="text-xl font-bold text-primary">{step}</span>
      </div>

      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{desc}</p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   LandingPage
───────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="bg-background text-foreground overflow-hidden">
      {/* ────────────────────────────────────────
          Section A — Kinetic Hero
      ──────────────────────────────────────── */}
      <section
        id="hero"
        className="relative overflow-hidden pt-36 pb-20"
      >
        {/* Aurora background glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-32 h-[45rem] w-[45rem] rounded-full bg-primary/10 blur-[140px]" />
          <div className="absolute top-1/3 -right-40 h-[38rem] w-[38rem] rounded-full bg-chart-1/8 blur-[130px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-16">

          {/* ── Massive full-width headline ── */}
          <h1 className="mb-14 text-[clamp(3.5rem,10vw,6.5rem)] font-extrabold leading-[0.95] tracking-tight text-foreground">
            Accelerate Your Career<br />
            With Expert{' '}
            <span className="text-primary">Mentorship.</span>
          </h1>

          {/* ── Bottom two-column row ── */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">

            {/* Left — testimonial / social proof */}
            <div className="flex flex-col justify-between gap-8">
              {/* Stars */}
              <div>
                <div className="mb-4 flex gap-1" aria-label="5 star rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="size-5 text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="max-w-[22ch] text-sm leading-relaxed text-muted-foreground">
                  "My mentor helped me land a senior engineering role in 3 months.
                  The structured roadmap and weekly check-ins made all the difference."
                </blockquote>

                <p className="mt-3 text-xs font-medium text-foreground">
                  Sara K. — Frontend Engineer
                </p>
              </div>

              {/* Pagination dots */}
              <div className="flex items-center gap-2">
                <div className="h-1 w-6 rounded-full bg-primary" />
                <div className="h-1 w-3 rounded-full bg-border" />
                <div className="h-1 w-3 rounded-full bg-border" />
              </div>
            </div>

            {/* Right — description + paired CTA buttons */}
            <div className="flex flex-col justify-between gap-8">
              <p className="text-base leading-relaxed text-muted-foreground max-w-sm">
                Connect with industry professionals who've navigated the exact
                challenges you're facing. Our mentors have helped{' '}
                <span className="font-medium text-foreground">10,000+ learners</span>{' '}
                reach their next milestone.
              </p>

              {/* CTA rows — each is a wide pill + small icon square */}
              <div className="flex flex-col gap-3">
                {/* Primary CTA row */}
                <div className="flex items-stretch gap-2">
                  <Button asChild size="lg" className="flex-1 justify-center">
                    <Link to="/mentors">Find a Mentor</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="aspect-square px-0 shrink-0">
                    <Link to="/mentors" aria-label="Browse mentor list">
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>

                {/* Secondary CTA row */}
                <div className="flex items-stretch gap-2">
                  <Button asChild size="lg" variant="outline" className="flex-1 justify-center">
                    <Link to="/login">Get Started Free</Link>
                  </Button>
                  <Button asChild size="lg" className="aspect-square px-0 shrink-0 bg-primary/20 hover:bg-primary/30 text-primary border-0">
                    <Link to="/login" aria-label="Create your account">
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ────────────────────────────────────────
          Section B — Trust Metrics Band
      ──────────────────────────────────────── */}
      <section
        id="metrics"
        className="border-y border-border bg-muted/30 py-7"
        aria-label="Platform statistics"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-20">
            {[
              { value: '500+', label: 'Expert Mentors' },
              { value: '10k+', label: 'Sessions Completed' },
              { value: '4.9★', label: 'Average Rating' },
              { value: '50+', label: 'Tech Domains' },
              { value: '95%', label: 'Goal Achievement' },
            ].map(({ value, label }, idx, arr) => (
              <React.Fragment key={label}>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {label}
                  </p>
                </div>
                {idx < arr.length - 1 && (
                  <div className="hidden h-8 w-px bg-border md:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────
          Section C — Bento Grid (Master Your Stack)
      ──────────────────────────────────────── */}
      <section id="stack" className="relative py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-1/4 h-[30rem] w-[30rem] rounded-full bg-chart-1/8 blur-[110px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-16">
          {/* Section header */}
          <div className="mb-16">
            <p className="mb-4 text-xs uppercase tracking-[0.45em] text-muted-foreground">
              Domain Expertise
            </p>
            <h2 className="text-4xl font-bold uppercase tracking-tight text-foreground lg:text-5xl">
              Master Your Stack
            </h2>
          </div>

          {/* Asymmetrical bento grid */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6 [grid-auto-rows:13rem]">
            {/* Frontend — large (2 cols × 2 rows) */}
            <BentoCard
              className="lg:col-span-2 lg:row-span-2"
              icon={<Monitor className="size-5" />}
              title="Frontend Engineering"
              desc="React, Vue, TypeScript, CSS architecture, Web Performance & Accessibility."
              glowClass="from-blue-500/15 via-cyan-400/10 to-transparent"
            />

            {/* Backend */}
            <BentoCard
              icon={<Server className="size-5" />}
              title="Backend Engineering"
              desc="Node.js, Python, REST & GraphQL APIs, databases & system design."
              glowClass="from-violet-500/15 to-transparent"
            />

            {/* AI / ML */}
            <BentoCard
              icon={<Cpu className="size-5" />}
              title="AI & Machine Learning"
              desc="PyTorch, LLMs, MLOps pipelines, and applied research."
              glowClass="from-emerald-500/15 to-transparent"
            />

            {/* Infrastructure */}
            <BentoCard
              icon={<Cloud className="size-5" />}
              title="Cloud & Infrastructure"
              desc="AWS, GCP, Kubernetes, DevOps, CI/CD and Infrastructure-as-Code."
              glowClass="from-orange-400/15 to-transparent"
            />

            {/* Mobile */}
            <BentoCard
              icon={<Smartphone className="size-5" />}
              title="Mobile Development"
              desc="React Native, Swift, Kotlin, and Flutter for cross-platform apps."
              glowClass="from-rose-500/15 to-transparent"
            />
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────
          Section D — The Process
      ──────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="relative border-y border-border bg-muted/20 py-28"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          {/* Section header */}
          <div className="mb-20 text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.45em] text-muted-foreground">
              Simple Process
            </p>
            <h2 className="text-4xl font-bold uppercase tracking-tight text-foreground lg:text-5xl">
              How It Works
            </h2>
          </div>

          {/* Steps grid */}
          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            <ProcessStep
              step="01"
              title="Browse Mentors"
              desc="Explore our curated roster of verified industry professionals across every major tech domain."
            />
            <ProcessStep
              step="02"
              title="Book a Session"
              desc="Schedule a 1-on-1 session at a time that works for you — sessions are flexible and goal-driven."
            />
            <ProcessStep
              step="03"
              title="Grow Together"
              desc="Receive personalized guidance, code reviews, career advice, and a clear roadmap to your next milestone."
              isLast
            />
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────
          Section E — Final CTA Push
      ──────────────────────────────────────── */}
      <section id="cta" className="relative overflow-hidden py-36">
        {/* Central aurora glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.45em] text-muted-foreground">
            Start Today
          </p>
          <h2 className="mb-8 text-5xl font-extrabold uppercase leading-[1.05] tracking-tight text-foreground lg:text-7xl">
            Ready to<br />
            <span className="text-primary">Level Up</span>?
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Join thousands of developers, designers, and engineers who have
            accelerated their careers through expert mentorship.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2 px-10">
              <Link to="/login">
                Get Started Free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-10">
              <Link to="/mentors">Explore Mentors</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}