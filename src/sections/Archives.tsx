import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { archivesConfig } from '../config';

export default function Archives() {
  const sectionRef = useRef<HTMLElement>(null);
  const vaultButtonRef = useRef<HTMLButtonElement>(null);
  const previewCarouselRef = useRef<HTMLDivElement>(null);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Auto-rotate preview carousel
  useEffect(() => {
    if (!isVaultOpen && archivesConfig.items.length > 0) {
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % archivesConfig.items.length);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isVaultOpen]);

  // Vault button entrance animation
  useEffect(() => {
    if (!vaultButtonRef.current) return;

    gsap.fromTo(
      vaultButtonRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  // Update carousel position
  useEffect(() => {
    if (previewCarouselRef.current) {
      gsap.to(previewCarouselRef.current, {
        x: `-${currentIndex * 100}%`,
        duration: 0.8,
        ease: 'power3.out',
      });
    }
  }, [currentIndex]);

  const toggleVault = () => {
    setIsVaultOpen(!isVaultOpen);
  };

  return (
    <section
      id="archives"
      ref={sectionRef}
      className="relative w-full bg-black"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      {/* Section Label - Top Right */}
      <div className="absolute top-8 right-8 md:top-12 md:right-12 text-[10px] md:text-xs text-white/60 tracking-widest uppercase z-20">
        {archivesConfig.sectionLabel}
      </div>

      {/* Main Content - Circular Vault Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          ref={vaultButtonRef}
          onClick={toggleVault}
          className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-white/30 flex items-center justify-center group hover:border-white/60 transition-colors duration-500"
        >
          <span className="text-white text-xs md:text-sm tracking-widest uppercase text-center px-4">
            {archivesConfig.vaultTitle}
          </span>

          {/* Pulsing ring animation */}
          <div className="absolute inset-0 rounded-full border border-white/20 animate-ping"></div>
        </button>
      </div>

      {/* Bottom Preview Carousel */}
      <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 border-t border-white/10 overflow-hidden">
        <div className="absolute top-4 left-6 md:left-10 text-[10px] md:text-xs text-white/40 tracking-widest uppercase z-10">
          {archivesConfig.items[currentIndex]?.label}
        </div>

        <div
          ref={previewCarouselRef}
          className="flex h-full"
          style={{ width: `${archivesConfig.items.length * 100}%` }}
        >
          {archivesConfig.items.map((item, index) => (
            <div
              key={index}
              className="h-full flex-shrink-0"
              style={{ width: `${100 / archivesConfig.items.length}%` }}
            >
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(100%) brightness(0.7)' }}
              />
            </div>
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Vault Overlay - Full Screen Modal */}
      {isVaultOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Close Button */}
          <button
            onClick={toggleVault}
            className="absolute top-6 right-6 md:top-10 md:right-10 text-white text-xs tracking-widest uppercase hover:text-white/60 transition-colors duration-300 z-10"
          >
            {archivesConfig.closeText}
          </button>

          {/* Image Grid */}
          <div className="w-full h-full overflow-y-auto p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-7xl mx-auto">
              {archivesConfig.items.map((item, index) => (
                <div
                  key={index}
                  className="relative aspect-[3/4] overflow-hidden group"
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: 'grayscale(100%)' }}
                  />

                  {/* Label Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-white text-xs md:text-sm tracking-wider">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
