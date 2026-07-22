import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { facilitiesConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Facilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const facilitiesRowRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: labelRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (facilitiesRowRef.current) {
        const items = facilitiesRowRef.current.querySelectorAll('.facility-item');
        gsap.fromTo(
          items,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: facilitiesRowRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="facilities" ref={sectionRef} className="relative w-full bg-white">
      {/* Section Label - Absolute Top Right */}
      <div
        ref={labelRef}
        className="absolute top-8 right-8 md:top-12 md:right-12 text-[10px] md:text-xs text-black/60 tracking-widest uppercase z-10"
      >
        {facilitiesConfig.sectionLabel}
      </div>

      {/* Spacer for scroll space */}
      <div style={{ height: '12vh' }}></div>

      {/* 4 Columns Facilities Row - Full Width, Full Height */}
      <div
        ref={facilitiesRowRef}
        className="grid grid-cols-1 md:grid-cols-4 w-full facilities-grid"
        style={{ height: 'auto', minHeight: '90vh' }}
      >
        {facilitiesConfig.items.map((facility, index) => (
          <div
            key={facility.slug}
            className="facility-item relative flex flex-col"
            style={{
              borderRight: index < facilitiesConfig.items.length - 1 ? '1px solid #000' : 'none',
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Facility Image */}
            <div className="relative overflow-hidden flex-1" style={{ minHeight: '50vh' }}>
              <img
                src={facility.image}
                alt={facility.name}
                className="w-full h-full object-cover transition-transform duration-700"
                style={{
                  transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                  filter: 'grayscale(100%) contrast(1.1)',
                }}
              />

              {/* Hover Overlay */}
              <div
                className="absolute inset-0 bg-black transition-opacity duration-500"
                style={{
                  opacity: hoveredIndex === index ? 0.2 : 0,
                }}
              ></div>
            </div>

            {/* Facility Info */}
            <div className="bg-white p-6 md:p-8 border-t border-black">
              {/* Facility Name */}
              <h3
                className="text-black text-lg md:text-xl font-bold mb-2 tracking-tight"
                style={{ fontFamily: "'Geist Pixel', 'IBM Plex Mono', monospace" }}
              >
                {facility.name}
              </h3>

              {/* Facility Code */}
              {facility.code && (
                <div className="text-black/40 text-[10px] md:text-xs tracking-widest mb-3">
                  {facility.code}
                </div>
              )}

              {/* Address & Status */}
              <div className="space-y-1 text-black/60 text-[10px] md:text-xs">
                {facility.address && <div>{facility.address}</div>}
                {facility.status && <div>{facility.status}</div>}
              </div>

              {/* CTA Link */}
              <Link
                to={`/facility/${facility.slug}`}
                className="inline-block mt-4 text-black text-[10px] md:text-xs tracking-wider hover:underline underline-offset-4 transition-all duration-300"
                style={{
                  opacity: hoveredIndex === index ? 1 : 0.6,
                }}
              >
                VIEW DETAILS →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
