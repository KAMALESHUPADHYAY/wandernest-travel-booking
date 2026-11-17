'use client';

import React, { useEffect, useRef } from 'react';

interface LeafletDestinationMapProps {
  latitude: number;
  longitude: number;
  destinationName: string;
  cityName: string;
  hotels?: any[];
  className?: string;
}

export default function LeafletDestinationMap({
  latitude,
  longitude,
  destinationName,
  cityName,
  hotels = [],
  className = 'h-[380px] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800',
}: LeafletDestinationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;

      // Clean existing instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Destination Center Marker
      const centerIconHtml = `
        <div class="px-3 py-1.5 rounded-full font-black text-xs shadow-xl transition-all whitespace-nowrap bg-[#003B95] text-white border-2 border-[#FEBB02] flex items-center gap-1.5 ring-4 ring-blue-500/20">
          <span>📍</span>
          <span>${destinationName}</span>
        </div>
      `;

      const centerIcon = L.divIcon({
        className: 'custom-destination-marker',
        html: centerIconHtml,
        iconSize: [120, 36],
        iconAnchor: [60, 18],
      });

      L.marker([latitude, longitude], { icon: centerIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 font-sans">
            <h4 class="font-bold text-sm text-[#003B95]">${destinationName}</h4>
            <p class="text-xs text-slate-600">${cityName}</p>
          </div>
        `);

      // Nearby Hotel Markers
      hotels.forEach((h) => {
        if (!h.latitude || !h.longitude) return;
        const hotelIconHtml = `
          <div class="px-2 py-0.5 rounded-full font-bold text-[10px] shadow-md transition-all whitespace-nowrap bg-[#0071C2] hover:bg-[#003B95] text-white border border-white">
            🏨 $${h.pricePerNight}
          </div>
        `;

        const hotelIcon = L.divIcon({
          className: 'custom-hotel-pin',
          html: hotelIconHtml,
          iconSize: [70, 24],
          iconAnchor: [35, 12],
        });

        L.marker([h.latitude, h.longitude], { icon: hotelIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2 font-sans max-w-[180px]">
              <h5 class="font-bold text-xs text-slate-900">${h.name}</h5>
              <p class="text-[11px] text-emerald-700 font-semibold mt-0.5">From $${h.pricePerNight} / night</p>
              <a href="/hotels/${h.id}" class="text-[10px] text-[#0071C2] font-bold block mt-1 hover:underline">View Property ➔</a>
            </div>
          `);
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, destinationName, cityName, hotels]);

  return <div ref={mapContainerRef} className={className} />;
}
