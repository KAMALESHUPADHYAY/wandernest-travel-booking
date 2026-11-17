'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

interface LeafletHotelMapProps {
  hotels: any[];
  highlightedHotelId?: string | null;
  onSelectHotel?: (hotelId: string) => void;
  className?: string;
}

export default function LeafletHotelMap({
  hotels,
  highlightedHotelId,
  onSelectHotel,
  className = 'h-[500px] w-full',
}: LeafletHotelMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;

      // Clean existing map instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default center: First hotel or Paris
      const firstHotel = hotels[0];
      const initialLat = firstHotel?.latitude || 48.8566;
      const initialLng = firstHotel?.longitude || 2.3522;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: hotels.length > 1 ? 12 : 13,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      markersRef.current = {};

      const latLngs: [number, number][] = [];

      hotels.forEach((hotel) => {
        if (!hotel.latitude || !hotel.longitude) return;

        const isHighlighted = hotel.id === highlightedHotelId;
        const latLng: [number, number] = [hotel.latitude, hotel.longitude];
        latLngs.push(latLng);

        // Custom HTML pill marker with price
        const priceText = `$${hotel.pricePerNight}`;
        const markerHtml = `
          <div class="px-2.5 py-1 rounded-full font-black text-xs shadow-md transition-all cursor-pointer whitespace-nowrap border ${
            isHighlighted
              ? 'bg-[#FEBB02] text-slate-950 scale-110 border-slate-900 ring-2 ring-[#0071C2]'
              : 'bg-[#0071C2] hover:bg-[#003B95] text-white border-white'
          }">
            ${priceText}
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-hotel-price-pin',
          html: markerHtml,
          iconSize: [60, 28],
          iconAnchor: [30, 14],
        });

        const marker = L.marker(latLng, { icon: customIcon }).addTo(map);

        const primaryImage = hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80';

        // Popup content
        const popupContent = `
          <div style="width: 220px; font-family: inherit;">
            <img src="${primaryImage}" alt="${hotel.name}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
            <h4 style="font-weight: 700; font-size: 13px; margin: 0 0 4px 0; color: #0f172a; line-height: 1.2;">${hotel.name}</h4>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 11px; color: #64748b;">${hotel.city}</span>
              <span style="font-size: 11px; font-weight: 700; background: #003B95; color: white; padding: 1px 6px; border-radius: 4px;">${hotel.rating.toFixed(1)}</span>
            </div>
            <div style="display: flex; align-items: baseline; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px;">
              <span style="font-size: 10px; color: #64748b;">From</span>
              <span style="font-size: 14px; font-weight: 800; color: #0071C2;">$${hotel.pricePerNight}<span style="font-size: 10px; font-weight: 400; color: #64748b;">/night</span></span>
            </div>
            <a href="/hotels/${hotel.id}" style="display: block; text-align: center; background: #0071C2; color: white; font-weight: 700; font-size: 11px; padding: 6px; border-radius: 6px; text-decoration: none; margin-top: 8px;">
              View Property
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onSelectHotel) onSelectHotel(hotel.id);
        });

        markersRef.current[hotel.id] = marker;
      });

      // Fit map bounds to show all markers nicely
      if (latLngs.length > 1) {
        map.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] });
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [hotels, highlightedHotelId]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
}
