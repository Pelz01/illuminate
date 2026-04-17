import { ReactNode } from "react";

interface SectionProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  id?: string;
}

export const SectionHeader = ({ eyebrow, title, description, align = "center" }: Omit<SectionProps, "children">) => (
  <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    {eyebrow && (
      <div className={`flex items-center gap-2 ${align === "center" ? "justify-center" : ""}`}>
        <span className="h-px w-8 bg-primary/60" />
        <span className="text-xs uppercase tracking-[0.25em] text-primary/90 font-mono">{eyebrow}</span>
      </div>
    )}
    <h2 className="mt-5 font-serif-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-gradient">
      {title}
    </h2>
    {description && (
      <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">{description}</p>
    )}
  </div>
);

export const Section = ({ id, children, eyebrow, title, description, align }: SectionProps) => (
  <section id={id} className="relative py-24 md:py-32">
    <div className="container">
      {(eyebrow || title) && (
        <SectionHeader eyebrow={eyebrow} title={title} description={description} align={align} />
      )}
      {children}
    </div>
  </section>
);

export default Section;
