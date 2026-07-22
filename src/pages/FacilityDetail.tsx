import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { facilitiesConfig } from '../config';

export default function FacilityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [currentTime, setCurrentTime] = useState('');

  // Find facility data by slug
  const facility = facilitiesConfig.items.find((item) => item.slug === slug);

  // Update local time based on UTC offset
  useEffect(() => {
    if (!facility) return;

    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const localTime = new Date(utc + 3600000 * facility.utcOffset);

      const hours = localTime.getHours().toString().padStart(2, '0');
      const minutes = localTime.getMinutes().toString().padStart(2, '0');
      const seconds = localTime.getSeconds().toString().padStart(2, '0');

      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [facility]);

  // Handle facility not found
  if (!facility) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-black text-2xl mb-4" style={{ fontFamily: "'Geist Pixel', 'IBM Plex Mono', monospace" }}>
            {facilitiesConfig.detailNotFoundText}
          </h1>
          <Link
            to="/"
            className="text-black/60 text-sm tracking-wider hover:underline underline-offset-4"
          >
            {facilitiesConfig.detailReturnText}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Side - Full Height Image */}
      <div className="w-full md:w-1/2 relative overflow-hidden" style={{ height: '50vh', minHeight: '400px' }}>
        <img
          src={facility.image}
          alt={facility.name}
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(100%) contrast(1.1)' }}
        />

        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-6 left-6 md:top-10 md:left-10 text-white text-xs tracking-widest uppercase bg-black/50 backdrop-blur-sm px-4 py-2 hover:bg-black/70 transition-colors duration-300"
        >
          {facilitiesConfig.detailBackText}
        </Link>
      </div>

      {/* Right Side - Facility Details */}
      <div className="w-full md:w-1/2 flex flex-col" style={{ minHeight: '100vh' }}>
        {/* Header Info */}
        <div className="p-6 md:p-10 border-b border-black">
          <h1
            className="text-black text-2xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: "'Geist Pixel', 'IBM Plex Mono', monospace" }}
          >
            {facility.name}
          </h1>

          {facility.code && (
            <div className="text-black/40 text-xs md:text-sm tracking-widest mb-6">
              {facility.code}
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-black/60 text-[10px] md:text-xs">
            {facility.address && (
              <div>
                <div className="text-black/40 uppercase tracking-wider mb-1">Address</div>
                <div>{facility.address}</div>
              </div>
            )}
            {facility.status && (
              <div>
                <div className="text-black/40 uppercase tracking-wider mb-1">Status</div>
                <div>{facility.status}</div>
              </div>
            )}
            {facility.email && (
              <div>
                <div className="text-black/40 uppercase tracking-wider mb-1">Email</div>
                <div className="break-all">{facility.email}</div>
              </div>
            )}
            {facility.phone && (
              <div>
                <div className="text-black/40 uppercase tracking-wider mb-1">Phone</div>
                <div>{facility.phone}</div>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <a
            href={facility.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-black text-white px-6 py-3 text-xs tracking-wider uppercase hover:bg-black/80 transition-colors duration-300"
          >
            {facility.ctaText}
          </a>
        </div>

        {/* Article Content */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          <h2
            className="text-black text-lg md:text-xl font-bold mb-6"
            style={{ fontFamily: "'Geist Pixel', 'IBM Plex Mono', monospace" }}
          >
            {facility.article.title}
          </h2>

          <div className="space-y-4 text-black/70 text-xs md:text-sm leading-relaxed">
            {facility.article.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Bottom - Local Time Clock */}
        <div className="border-t border-black p-6 md:p-10">
          <div className="flex items-center justify-between">
            <div className="text-black/40 text-[10px] md:text-xs uppercase tracking-wider">
              Local Time
            </div>
            <div
              className="text-black text-2xl md:text-3xl lg:text-4xl tabular-nums"
              style={{ fontFamily: "'Geist Pixel', 'IBM Plex Mono', monospace" }}
            >
              {currentTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
