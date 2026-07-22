import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { manifestoConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text animation - clip reveal from left
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Video animation - clip reveal from right
      if (videoRef.current) {
        gsap.fromTo(
          videoRef.current,
          { clipPath: 'inset(0 0 0 100%)' },
          {
            clipPath: 'inset(0 0 0 0%)',
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: videoRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative w-full bg-white flex flex-col md:flex-row"
      style={{ minHeight: '70vh' }}
    >
      {/* Left Side - Text Content */}
      <div
        ref={textRef}
        className="w-full md:w-1/2 flex items-center p-8 md:p-16 lg:p-24"
      >
        <div className="max-w-xl">
          <p
            className="text-black text-lg md:text-2xl lg:text-3xl leading-relaxed md:leading-relaxed lg:leading-relaxed"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {manifestoConfig.text}
          </p>
        </div>
      </div>

      {/* Right Side - Video */}
      <div
        ref={videoRef}
        className="w-full md:w-1/2 relative overflow-hidden"
        style={{ minHeight: '50vh' }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={manifestoConfig.videoPath} type="video/mp4" />
        </video>

        {/* Scan line overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          }}
        ></div>
      </div>
    </section>
  );
}
