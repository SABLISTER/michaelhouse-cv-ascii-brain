import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import AsciiCanvas from '../components/AsciiCanvas';
import { heroConfig, navigationConfig } from '../config';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    if (titleRef.current) {
      const lines = titleRef.current.querySelectorAll('.title-line');
      tl.fromTo(
        lines,
        { opacity: 0, x: -60, filter: 'blur(8px)' },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    }

    if (notesRef.current) {
      const notes = notesRef.current.querySelectorAll('.note-item');
      tl.fromTo(
        notes,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out' },
        '-=0.5'
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-black">
      {/* Left Panel - Fixed Navigation & Title */}
      <div className="absolute left-0 top-0 w-[40%] min-w-[320px] h-full z-20 flex flex-col justify-between p-6 md:p-10 border-r border-white/10">
        {/* Navigation */}
        <nav className="flex items-start justify-between">
          <div
            className="text-white text-lg md:text-xl tracking-tight"
            style={{ fontFamily: "'Geist Pixel', 'IBM Plex Mono', monospace" }}
          >
            {navigationConfig.brandName}
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-8 text-[10px] md:text-xs text-white/70 tracking-wider">
            {navigationConfig.links.map((link, index) => (
              <span key={link.href} className="flex items-center gap-2 md:gap-8">
                <a
                  href={link.href}
                  className="hover:text-white transition-colors duration-300 hover:underline underline-offset-4"
                >
                  {link.label}
                </a>
                {index < navigationConfig.links.length - 1 && (
                  <span className="hidden md:inline text-white/30">·</span>
                )}
              </span>
            ))}
          </div>
        </nav>

        {/* Title Area */}
        <div className="flex-1 flex flex-col justify-center mt-16 md:mt-0">
          <div className="text-[10px] md:text-xs text-white/50 tracking-widest mb-4 md:mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-white/80 inline-block animate-pulse"></span>
            {heroConfig.eyebrow}
          </div>

          <h1
            ref={titleRef}
            className="text-white text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6 md:mb-8"
            style={{ fontFamily: "'Geist Pixel', 'IBM Plex Mono', monospace" }}
          >
            {heroConfig.titleLines.map((line) => (
              <span key={line} className="title-line block">
                {line}
              </span>
            ))}
          </h1>

          <p className="text-white/60 text-xs md:text-sm leading-relaxed max-w-[280px] md:max-w-xs">
            {heroConfig.leadText}
          </p>
        </div>

        {/* Supporting Notes */}
        <div ref={notesRef} className="space-y-3 md:space-y-4">
          {heroConfig.supportingNotes.map((note, index) => (
            <div
              key={note}
              className="note-item flex items-start gap-3 text-[10px] md:text-xs text-white/50"
            >
              <span className="text-white/30 flex-shrink-0">
                0{index + 1}
              </span>
              <span className="leading-relaxed">{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - ASCII Moon Field */}
      <div className="absolute right-0 top-0 w-[60%] h-full z-10">
        <AsciiCanvas />

        {/* Gradient Overlay for blending */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-20 flex items-center gap-3 text-white/40 text-[10px] tracking-widest">
        <span>SCROLL</span>
        <div className="w-12 h-px bg-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/60 animate-[scroll-line_2s_ease-in-out_infinite]"></div>
        </div>
        <style>{`
          @keyframes scroll-line {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    </section>
  );
}
