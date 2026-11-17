'use client';

import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HotelGalleryProps {
  images: string[];
  hotelName: string;
}

export function HotelGallery({ images, hotelName }: HotelGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayImages = images.length > 0
    ? images
    : [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      ];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + displayImages.length) % displayImages.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % displayImages.length);
    }
  };

  return (
    <>
      {/* 5-Photo Mosaic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 h-[340px] md:h-[420px] rounded-3xl overflow-hidden shadow-sm">
        {/* Main Large Image (Left half) */}
        <div
          onClick={() => setLightboxIndex(0)}
          className="md:col-span-2 h-full overflow-hidden cursor-pointer relative group"
        >
          <img
            src={displayImages[0]}
            alt={hotelName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        </div>

        {/* 2x2 Grid (Right half) */}
        <div className="hidden md:grid col-span-2 grid-cols-2 gap-2.5 h-full">
          {displayImages.slice(1, 5).map((img, i) => {
            const actualIndex = i + 1;
            const isLast = i === 3 && displayImages.length > 5;
            return (
              <div
                key={actualIndex}
                onClick={() => setLightboxIndex(actualIndex)}
                className="relative h-full overflow-hidden cursor-pointer group"
              >
                <img
                  src={img}
                  alt={`${hotelName} ${actualIndex}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                {isLast ? (
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-xs gap-1.5">
                    <Camera className="h-4 w-4" />
                    <span>+{displayImages.length - 4} photos</span>
                  </div>
                ) : (
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                    View
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Active Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <img
                src={displayImages[lightboxIndex]}
                alt={`${hotelName} photo ${lightboxIndex + 1}`}
                className="w-full h-full object-contain max-h-[80vh] rounded-2xl"
              />
              <div className="absolute bottom-3 left-4 text-xs font-semibold text-white/90 bg-black/50 px-3 py-1 rounded-full">
                {lightboxIndex + 1} / {displayImages.length}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
