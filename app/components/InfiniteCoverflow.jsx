"use client";

import React, { useState, useEffect } from "react";

const slides = [
  {
    image: "/screenshots/signin-preview.png",
    tag: "SIGN IN",
    title: "Pick up right where you left off",
    description: "A fast, familiar sign-in with email or Google.",
  },
  {
    image: "/screenshots/signup-preview.png",
    tag: "SIGN UP",
    title: "Set up your vault in seconds",
    description: "No lengthy onboarding, just start tracking.",
  },
  {
    image: "/screenshots/dashboard-preview.png",
    tag: "DASHBOARD",
    title: "See every renewal at a glance",
    description: "Upcoming charges, due-this-week alerts, all in one view.",
  },
];

export default function InfiniteCoverflow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const getSlideStyle = (index) => {
    const total = slides.length;
    const diff = (index - currentIndex + total) % total;

    if (diff === 0) {
      return "z-20 scale-100 opacity-100 blur-0 translate-x-0 pointer-events-auto shadow-2xl";
    } else if (diff === 1 || diff === -(total - 1)) {
      return "z-10 scale-90 opacity-30 blur-sm translate-x-[42%] pointer-events-none";
    } else {
      return "z-10 scale-90 opacity-30 blur-sm -translate-x-[42%] pointer-events-none";
    }
  };

  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center overflow-hidden">
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
        {slides.map((slide, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`absolute transition-all duration-700 ease-in-out cursor-pointer w-[650px] max-w-[90vw] rounded-xl overflow-hidden border border-white/10 ${getSlideStyle(
              index
            )}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
        ))}
      </div>

      {/* Clean Dynamic Text Panel */}
      <div className="text-center mt-6 transition-all duration-300 max-w-md">
        <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase block mb-1">
          {slides[currentIndex].tag}
        </span>
        <h3 className="text-lg font-semibold text-white">
          {slides[currentIndex].title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          {slides[currentIndex].description}
        </p>
      </div>

      {/* Indicator Dots */}
      <div className="flex gap-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === index ? "w-6 bg-indigo-500" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}