"use client";

import React, { useState, useEffect } from "react";

// The "?v=2" makes browsers fetch the NEW screenshot after you overwrite a file with the same name.
// Bump it (v=3, v=4...) any time you replace a screenshot again.
const slides = [
  {
    image: "/screenshots/dashboard-preview.png?v=2",
    tag: "DASHBOARD",
    title: "See every renewal at a glance",
    description: "Spend totals, upcoming charges and due-this-week alerts in one view.",
  },
  {
    image: "/screenshots/add-renewal-preview.png?v=2",
    tag: "SCAN & ADD",
    title: "Scan a receipt, skip the typing",
    description: "Drop in a screenshot and the service, amount and date fill in for you.",
  },
  {
    image: "/screenshots/calendar-preview.png?v=2",
    tag: "CALENDAR",
    title: "See the month ahead",
    description: "Every upcoming charge laid out on a calendar, so no week catches you off guard.",
  },
  {
    image: "/screenshots/rates-preview.png?v=2",
    tag: "RATES",
    title: "Currency rates and a quick converter",
    description: "Track in your own currency and convert in a tap.",
  },
  {
    image: "/screenshots/signup-preview.png",
    tag: "SIGN UP",
    title: "Set up your vault in seconds",
    description: "No lengthy onboarding, just start tracking.",
  },
];

export default function InfiniteCoverflow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Screenshots that fail to load are skipped, so a missing file never shows a broken image
  const [failed, setFailed] = useState(() => new Set());

  const activeSlides = slides.filter((slide) => !failed.has(slide.image));
  const total = activeSlides.length;
  const safeIndex = total > 0 ? currentIndex % total : 0;

  useEffect(() => {
    if (paused || total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, total]);

  if (total === 0) return null;

  const current = activeSlides[safeIndex];

  return (
    <section
      className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Header Section */}
      <div className="text-center mb-12">
        <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">
          Take a look inside
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">
          Every screen, built to get out of your way
        </h2>
      </div>

      {/* Carousel Viewport Container */}
      <div className="relative w-full max-w-5xl h-[340px] md:h-[400px] flex items-center justify-center">
        {activeSlides.map((slide, index) => {
          const diff = (index - safeIndex + total) % total;

          let position;
          if (diff === 0) {
            position = "z-20 scale-100 opacity-100 blur-0 translate-x-0 pointer-events-auto shadow-2xl";
          } else if (diff === 1) {
            position = "z-10 scale-90 opacity-30 blur-sm translate-x-[42%] pointer-events-auto";
          } else if (diff === total - 1) {
            position = "z-10 scale-90 opacity-30 blur-sm -translate-x-[42%] pointer-events-auto";
          } else {
            position = "z-0 scale-75 opacity-0 pointer-events-none";
          }

          return (
            <div
              key={slide.image}
              onClick={() => setCurrentIndex(index)}
              className={`absolute transition-all duration-700 ease-in-out cursor-pointer w-[650px] max-w-[90vw] rounded-xl overflow-hidden border border-white/10 ${position}`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-auto object-cover rounded-xl"
                onError={() => setFailed((prev) => new Set(prev).add(slide.image))}
              />
            </div>
          );
        })}
      </div>

      {/* Clean Dynamic Text Panel */}
      <div className="text-center mt-6 transition-all duration-300 max-w-md" aria-live="polite">
        <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase block mb-1">
          {current.tag}
        </span>
        <h3 className="text-lg font-semibold text-white">{current.title}</h3>
        <p className="text-xs text-gray-400 mt-1">{current.description}</p>
      </div>

      {/* Indicator Dots */}
      <div className="flex gap-2 mt-6">
        {activeSlides.map((slide, index) => (
          <button
            key={slide.image}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              safeIndex === index ? "w-6 bg-indigo-500" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}