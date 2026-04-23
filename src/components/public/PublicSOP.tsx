interface SOPStep {
  title: string;
  description: string;
}

interface PublicSOPProps {
  eyebrow?: string;
  title: string;
  purpose: string;
  steps: SOPStep[];
  next: string;
  compact?: boolean;
  className?: string;
}

export function PublicSOP({
  eyebrow = 'Quick guide',
  title,
  purpose,
  steps,
  next,
  compact = false,
  className = '',
}: PublicSOPProps) {
  return (
    <section className={`card ${compact ? 'p-5 sm:p-6' : 'card-lead p-6 sm:p-8'} ${className}`.trim()}>
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2
          className={`mt-2 font-serif font-semibold tracking-[-0.02em] text-[var(--ink-900)] ${
            compact ? 'text-[clamp(28px,4vw,40px)]' : 'text-[clamp(30px,4vw,42px)]'
          }`}
        >
          {title}
        </h2>
      </div>

      <div className="mt-5 rounded-[var(--r-lg)] border border-[var(--line)] bg-[var(--card-alt)] p-4 sm:p-5">
        <div className="eyebrow">What this page is for</div>
        <p className="mt-3 max-w-[62ch] text-sm leading-6 text-[var(--text-soft)]">{purpose}</p>
      </div>

      <div className={`mt-5 grid items-start gap-4 ${compact ? 'md:grid-cols-3' : 'lg:grid-cols-3'}`}>
        {steps.map((step, index) => (
          <div
            key={`${step.title}-${index}`}
            className="rounded-[var(--r-lg)] border border-[var(--line)] bg-[var(--card)] p-4 sm:p-5"
          >
            <div className="row flex-nowrap items-center gap-3">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[var(--ink-900)] text-sm font-semibold text-white">
                {index + 1}
              </span>
              <div className="strong text-sm">{step.title}</div>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[var(--r-lg)] border border-[var(--ink-100)] bg-[var(--ink-025)] p-4 sm:p-5">
        <div className="eyebrow">What to do next</div>
        <p className="mt-3 max-w-[62ch] text-sm leading-6 text-[var(--text-soft)]">{next}</p>
      </div>
    </section>
  );
}
