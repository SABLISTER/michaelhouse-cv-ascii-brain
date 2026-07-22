import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { footerConfig } from '../config';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-black border-t border-white/10"
    >
      <div
        ref={contentRef}
        className="w-full px-6 md:px-10 py-8 md:py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        {/* Copyright Text */}
        <div
          className="text-white/60 text-[10px] md:text-xs tracking-wider"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {footerConfig.copyrightText}
        </div>

        {/* Status Text */}
        <div
          className="text-white/60 text-[10px] md:text-xs tracking-wider flex items-center gap-2"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"></span>
          {footerConfig.statusText}
        </div>
      </div>
    </footer>
  );
}
