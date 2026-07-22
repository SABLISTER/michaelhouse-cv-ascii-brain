import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { observationConfig } from '../config';

export default function Observation() {
  const sectionRef = useRef<HTMLElement>(null);
  const coordinatesRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState({
    lat: observationConfig.initialLat,
    lon: observationConfig.initialLon,
  });

  // Simulate live coordinate updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCoordinates({
        lat: observationConfig.initialLat + (Math.random() - 0.5) * 0.5,
        lon: observationConfig.initialLon + (Math.random() - 0.5) * 0.5,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!coordinatesRef.current) return;

    gsap.fromTo(
      coordinatesRef.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 }
    );
  }, []);

  return (
    <section id="observation" ref={sectionRef} className="relative w-full bg-black" style={{ height: '100vh' }}>
      {/* Section Label - Top Right */}
      <div className="absolute top-8 right-8 md:top-12 md:right-12 text-[10px] md:text-xs text-white/60 tracking-widest uppercase z-20">
        {observationConfig.sectionLabel}
      </div>

      {/* Full Screen Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={observationConfig.videoPath} type="video/mp4" />
      </video>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-10">
        {/* Status Badge */}
        <div className="flex justify-center mt-16 md:mt-20">
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 border border-white/20 flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span className="text-white text-[10px] md:text-xs tracking-widest uppercase">
              {observationConfig.statusText}
            </span>
          </div>
        </div>

        {/* Bottom Right - Live Coordinates */}
        <div
          ref={coordinatesRef}
          className="absolute bottom-6 right-6 md:bottom-10 md:right-10 text-right"
        >
          <div className="text-white/80 text-xs md:text-sm tracking-wider space-y-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            <div className="flex items-center justify-end gap-2">
              <span className="text-white/40">{observationConfig.latLabel}</span>
              <span className="tabular-nums">{coordinates.lat.toFixed(4)}</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-white/40">{observationConfig.lonLabel}</span>
              <span className="tabular-nums">{coordinates.lon.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
