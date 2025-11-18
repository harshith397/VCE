"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Target, CheckCircle, AlertCircle, TrendingUp, CalendarCheck } from 'lucide-react';

// Custom SVG Donut Chart with Animation
const CustomDonutChart = ({ percentage, mainColor, absentColor }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let rafId = null;
    const duration = 800;
    let startTs = null;

    const step = (ts) => {
      if (!startTs) startTs = ts;
      const elapsed = ts - startTs;
      const progress = Math.min(elapsed / duration, 1);
      const value = percentage * progress;
      setCurrentValue(value);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [percentage]);

  const size = 150;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (currentValue / 100) * circumference;

  return (
    <div className="w-full h-[150px] flex items-center justify-center py-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={absentColor}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={mainColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-foreground">
            {currentValue.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground mt-0.5">Attendance</div>
        </div>
      </div>
    </div>
  );
};

// Attendance Card Component
const AttendanceCard = React.memo(({ category, data, isActive }) => {
  const [target, setTarget] = useState("");

  const totalClasses = Number(data?.["Total Classes"] || 0);
  const presentees = Number(data?.["Presentees"] || 0);
  const extra = Number(data?.["Extra Classes"] || 0);
  const attended = presentees + extra;

  const currentPercent = totalClasses > 0 ? (attended / totalClasses) * 100 : 0;

  const getColorByPercentage = (percentage) => {
    if (percentage > 85) return "hsl(var(--success))";
    if (percentage >= 75) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  const mainColor = getColorByPercentage(currentPercent);
  const absentColor = "hsl(var(--muted))";

  const computeResult = () => {
    if (target === "" || !totalClasses) return null;
    const t = Number(target);
    const current = currentPercent;

    if (current >= t) {
      const canBunk = Math.floor((100 * attended) / t - totalClasses);
      return { mode: "bunk", count: canBunk >= 0 ? canBunk : 0 };
    }

    const ratio = t / 100;
    const rawNeed = (ratio * totalClasses - attended) / (1 - ratio);
    const needAttend = Math.ceil(rawNeed);
    const catLower = String(category || "").toLowerCase();
    let capTotal;
    if (catLower.includes("eca")) {
      capTotal = 16;
    } else if (catLower.includes("regular")) {
      capTotal = 400;
    } else {
      // Fallback when category is neither 'eca' nor 'regular'
      // Use 400 as a sensible default (semester-like cap). This can be
      // made configurable later if needed.
      capTotal = 400;
    }
    const maxRemaining = capTotal - totalClasses;

    if (!isFinite(rawNeed))
      return { mode: "unreachable", count: needAttend, maxRemaining };
    if (needAttend > maxRemaining)
      return { mode: "unreachable", count: needAttend, maxRemaining };

    return { mode: "attend", count: needAttend >= 0 ? needAttend : 0 };
  };

  const result = computeResult();

  return (
    <div 
      className={`bg-card h-full flex flex-col transition-all duration-300 ${
        isActive 
          ? 'scale-100 opacity-100' 
          : 'scale-95 opacity-70'
      }`}
      style={{
        borderRadius: '16px',
        border: '1px solid hsl(var(--border))',
        minHeight: '460px',
        width: '300px',
        maxWidth: '300px',
        boxShadow: isActive 
          ? '0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 8px 20px -8px rgba(0, 0, 0, 0.1)' 
          : '0 4px 12px -4px rgba(0, 0, 0, 0.06)',
        marginBottom: '20px', // Extra space for shadow
        paddingTop: '16px', // shift inner components slightly down
      }}
    >
      {/* Header */}
      <div className="pt-8 px-6 pb-4">
        <h3 className="text-lg font-bold text-foreground mb-4 text-center">{category}</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            {attended}/{totalClasses} Classes
          </span>
          <span
            className={`font-semibold px-2.5 py-0.5 rounded-full text-xs ${
              currentPercent >= 85
                ? "bg-green-100 text-green-700"
                : currentPercent >= 75
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {currentPercent >= 90 ? "Excellent" : currentPercent >= 75 ? "Good" : "Low"}
          </span>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="flex items-center justify-center px-5 py-3 flex-grow">
        <div className="w-full max-w-[180px]">
          <CustomDonutChart
            percentage={currentPercent}
            mainColor={mainColor}
            absentColor={absentColor}
          />
        </div>
      </div>

      {/* Target Calculator */}
      <div className="px-6 pb-6 space-y-3">
        <div className="flex items-center justify-center">
          <div className="flex items-center w-full max-w-[140px] gap-3">
            <Target className="w-6 h-6 text-muted-foreground" />
            <input
              type="number"
              placeholder="Target %"
              value={target}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") {
                  setTarget("");
                  return;
                }
                const n = Number(v);
                if (Number.isNaN(n)) return;
                const clamped = Math.max(0, Math.min(100, Math.round(n)));
                setTarget(clamped);
              }}
              className="w-full text-base pl-4 pr-2 h-10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-background"
              style={{ borderRadius: '10px', border: '1.25px solid hsl(var(--border))' }}
            />
          </div>
        </div>

        {/* Result - increased height, left-aligned, consistent left margin and stronger colors */}
        <div className="min-h-[72px] flex items-center mt-3">
          {result ? (
            result.mode === "bunk" ? (
              <div
                className="flex items-center gap-3 w-full py-3 rounded-lg pl-0 pr-3"
                style={{ backgroundColor: '#ecfdf5', border: '1px solid #bbf7d0' }}
              >
                <div className="pl-6 flex items-center">
                  <CheckCircle style={{ color: '#065f46' }} className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <p className="font-semibold text-sm leading-tight" style={{ color: '#065f46' }}>
                  You can bunk {result.count} classes
                </p>
              </div>
            ) : result.mode === "unreachable" ? (
              <div
                className="flex items-center gap-3 w-full py-3 rounded-lg pl-0 pr-3"
                style={{ backgroundColor: '#fff1f2', border: '1px solid #fecaca' }}
              >
                <div className="pl-6 flex items-center">
                  <AlertCircle style={{ color: '#7f1d1d' }} className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <p className="font-semibold text-sm leading-tight" style={{ color: '#7f1d1d' }}>
                  Target not attainable
                </p>
              </div>
            ) : (
              <div
                className="flex items-center gap-3 w-full py-3 rounded-lg pl-0 pr-3"
                style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}
              >
                <div className="pl-6 flex items-center">
                  <TrendingUp style={{ color: '#1e40af' }} className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <p className="font-semibold text-sm leading-tight" style={{ color: '#1e40af' }}>
                  Need {result.count} more classes
                </p>
              </div>
            )
          ) : (
            <div className="w-full py-3 rounded-lg pl-6 pr-3" style={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}>
              <p className="font-medium text-sm leading-tight" style={{ color: '#4b5563' }}>
                Set target to see projection
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// Main Carousel Component
const AttendanceOverviewCarousel = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [needsCarousel, setNeedsCarousel] = useState(false);
  const [gridCols, setGridCols] = useState(1);
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const categories = data ? Object.keys(data).filter(
    (k) => data[k] && data[k]["Total Attendance"] !== undefined
  ) : [];

  // Card and spacing configuration
  const CARD_WIDTH = 300;
  const CARD_SPACING = 16;
  const PEEK_WIDTH = 40; // Amount of next/prev card to show

  // Check if carousel is needed and determine grid columns
  useEffect(() => {
    const checkLayout = () => {
      if (!containerRef.current || categories.length === 0) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      
      // Calculate how many cards can fit in the container
      const availableWidth = containerWidth - 40; // Account for padding
      const maxCardsPerRow = Math.floor((availableWidth + CARD_SPACING) / (CARD_WIDTH + CARD_SPACING));
      
      // Determine if we need carousel or grid
      if (categories.length <= maxCardsPerRow) {
        // All cards can fit in one row
        setNeedsCarousel(false);
        setGridCols(categories.length);
      } else {
        // Need carousel
        setNeedsCarousel(true);
        setGridCols(1);
      }
    };

    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, [categories.length]);

  const scrollToIndex = useCallback((index) => {
    if (scrollRef.current && categories.length > 0) {
      const containerWidth = scrollRef.current.offsetWidth;
      const centerOffset = (containerWidth - CARD_WIDTH) / 2;
      
      // Calculate the position of the card
      const cardPosition = index * (CARD_WIDTH + CARD_SPACING);
      
      // Calculate the scroll position to center the card
      let scrollPosition = cardPosition - centerOffset + PEEK_WIDTH;
      
      // Get the total width of all cards
      const totalCardsWidth = categories.length * CARD_WIDTH + (categories.length - 1) * CARD_SPACING;
      const maxScroll = totalCardsWidth - containerWidth + (PEEK_WIDTH * 2);
      
      // Clamp the scroll position
      scrollPosition = Math.max(PEEK_WIDTH, Math.min(scrollPosition, maxScroll));
      
      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [categories.length]);

  // Update current index on scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !needsCarousel) return;
    
    const scrollLeft = scrollRef.current.scrollLeft;
    const containerWidth = scrollRef.current.offsetWidth;
    const centerOffset = (containerWidth - CARD_WIDTH) / 2;
    const adjustedScroll = scrollLeft + centerOffset - PEEK_WIDTH;
    const index = Math.round(adjustedScroll / (CARD_WIDTH + CARD_SPACING));
    
    setCurrentIndex(Math.max(0, Math.min(index, categories.length - 1)));
  }, [needsCarousel, categories.length]);

  // Navigation functions
  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const goToNext = () => {
    if (currentIndex < categories.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext(); // Swipe left - go to next
      } else {
        goToPrevious(); // Swipe right - go to previous
      }
    } else {
      // Snap back to current card if swipe wasn't enough
      scrollToIndex(currentIndex);
    }
  };

  if (!data || categories.length === 0) return null;

  return (
    <div className="w-full space-y-5 py-4" style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <CalendarCheck className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Attendance Overview
          </h2>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full" ref={containerRef}>
        {/* Navigation Buttons - Only show in carousel mode */}
        {needsCarousel && (
          <>
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 bg-white/95 hover:bg-white border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 rounded-full shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex === categories.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 bg-white/95 hover:bg-white border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 rounded-full shadow-lg"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Cards Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`
            ${needsCarousel 
              ? 'overflow-x-auto overflow-y-hidden' 
              : 'overflow-visible'
            }
            relative w-full
          `}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingTop: needsCarousel ? '20px' : '0',
            paddingBottom: needsCarousel ? '20px' : '40px', // Reduced bottom space when carousel active
          }}
        >
          <div
            className={`transition-transform duration-300 ease-out ${needsCarousel ? 'flex items-center h-full' : 'grid justify-center'}`}
            style={{
              display: needsCarousel ? 'flex' : 'grid',
              // Use a fixed gap for both modes. In carousel mode flex will use gap too in modern browsers.
              gap: `${CARD_SPACING}px`,
              // When in grid mode, explicitly set grid template columns so Tailwind's static classes are not required.
              gridTemplateColumns: needsCarousel ? undefined : `repeat(${gridCols}, ${CARD_WIDTH}px)`,
              paddingLeft: needsCarousel ? `${PEEK_WIDTH}px` : undefined,
              paddingRight: needsCarousel ? `${PEEK_WIDTH}px` : undefined,
              // For grid mode, ensure proper centering
              width: needsCarousel ? 'auto' : 'fit-content',
              margin: needsCarousel ? '0' : '0 auto',
            }}
          >
            {categories.map((category, index) => (
              <div
                key={category}
                className={needsCarousel ? 'flex-none snap-center' : ''}
                onClick={() => {
                  if (needsCarousel) {
                    setCurrentIndex(index);
                    scrollToIndex(index);
                  }
                }}
              >
                <AttendanceCard 
                  category={category} 
                  data={data[category]}
                  isActive={needsCarousel ? index === currentIndex : true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Dots - Only show in carousel mode */}
      {needsCarousel && (
        <div className="flex justify-center gap-2 pt-1 pb-2" style={{ marginTop: '-8px' }}>
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                scrollToIndex(index);
              }}
              className="transition-all duration-300 hover:scale-110"
              style={{
                width: index === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: index === currentIndex 
                  ? 'hsl(var(--primary))' 
                  : 'hsl(var(--muted-foreground) / 0.3)',
              }}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AttendanceOverviewCarousel;