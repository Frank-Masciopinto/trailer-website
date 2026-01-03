import React, { useState, useEffect } from 'react';
import { BlurFade } from './BlurFade';
import { TextAnimate } from './TextAnimate';
import { AnimatedGradientText } from './AnimatedGradientText';
import { MagicCard } from './MagicCard';
import { BorderBeam } from './BorderBeam';
import { NumberTicker } from './NumberTicker';
import { AxleToggleGroup } from './AxleToggleGroup';

// =============================================================================
// KIT_MAP - Data-driven URL mapping for all axle configurations
// =============================================================================

const KIT_MAP = {
  single: [
    { cap: '3.5K', value: 3.5, url: '/categories/axles/single-axle-kits/3-5k-single-axle-kits.html' },
    { cap: '5.2K', value: 5.2, url: '/categories/axles/single-axle-kits/5-2k-single-axle-kits.html' },
    { cap: '6K', value: 6, url: '/categories/axles/single-axle-kits/6k-single-axle-kits.html' },
    { cap: '7K', value: 7, url: '/categories/axles/7k-single-axle-kits.html' },
    { cap: '8K', value: 8, url: '/8k-single-axle-trailer-kit/' },
    { cap: '10K', value: 10, url: '/10k-single-axle-kits/' },
    { cap: '12K', value: 12, url: '/12k-single-axle-kits/' },
  ],
  tandem: [
    { cap: '3.5K', value: 3.5, url: '/categories/axles/tandem-axle-kits/tandem-axle-kits.html' },
    { cap: '5.2K', value: 5.2, url: '/categories/axles/tandem-axle-kits/5-2k-tandem-axle-kits.html' },
    { cap: '6K', value: 6, url: '/categories/axles/tandem-axle-kits/6k-tandem-axle-kits.html' },
    { cap: '7K', value: 7, url: '/categories/axles/tandem-axle-kits/7k-tandem-axle-kits.html' },
    { cap: '8K', value: 8, url: '/8k-tandem-axle-kits/' },
    { cap: '10K', value: 10, url: '/10k-tandem-axle-kits/' },
    { cap: '12K', value: 12, url: '/12k-tandem-axle-kits/' },
  ],
  triple: [
    { cap: '3.5K', value: 3.5, url: '/triple-axle-kits/' },
    { cap: '7K', value: 7, url: '/triple-axle-kits/' },
    { cap: '8K', value: 8, url: '/triple-axle-kits/' },
    { cap: '12K', value: 12, url: '/triple-axle-kits/' },
    { cap: '36K', value: 36, url: '/triple-axle-kits/' },
  ],
};

// localStorage keys
const STORAGE_KEY_AXLE = 'tpuAxleConfig';

// =============================================================================
// TRAILER ICONS - Different sized trailers drawn inside viewBox
// Smaller capacities = smaller trailer with more empty space
// =============================================================================

const TrailerIcon = ({ capacity, axleType = 'single' }) => {
  const commonProps = {
    viewBox: "0 0 100 60",
    fill: "none",
    className: "tpu-capacity-grid__icon"
  };
  
  // Calculate scale 0.45 to 1.0 based on capacity
  const getScale = () => {
    if (axleType === 'single') {
      return 0.45 + (Math.min(capacity, 12) - 3.5) / (12 - 3.5) * 0.55;
    } else if (axleType === 'tandem') {
      return 0.45 + (Math.min(capacity, 12) - 3.5) / (12 - 3.5) * 0.55;
    } else {
      return 0.45 + (Math.min(capacity, 36) - 3.5) / (36 - 3.5) * 0.55;
    }
  };

  const s = getScale();
  const axleCount = axleType === 'triple' ? 3 : axleType === 'tandem' ? 2 : 1;
  
  // Center offset - push smaller trailers toward center
  const offsetX = (1 - s) * 20;
  const offsetY = (1 - s) * 12;

  // Single axle trailer
  if (axleCount === 1) {
    // Base dimensions that get scaled
    const bodyW = 60 * s;
    const bodyH = 18 * s;
    const bodyX = 20 + offsetX;
    const bodyY = 22 + offsetY - bodyH / 2;
    const wheelR = 10 * s;
    const wheelY = 30 + offsetY + bodyH / 2 + wheelR * 0.6;
    const wheelX = bodyX + bodyW * 0.55;
    const hitchLen = 16 * s;
    const hitchBall = 4 * s;
    const strokeW = 2 + s * 2;
    
    return (
      <svg {...commonProps}>
        {/* Hitch tongue */}
        <path 
          d={`M${bodyX - hitchLen} ${22 + offsetY} L${bodyX} ${22 + offsetY}`} 
          stroke="currentColor" 
          strokeWidth={strokeW} 
          strokeLinecap="round" 
        />
        <circle cx={bodyX - hitchLen} cy={22 + offsetY} r={hitchBall} fill="currentColor" />
        
        {/* Trailer body */}
        <rect 
          x={bodyX} y={bodyY} 
          width={bodyW} height={bodyH} 
          rx={2 * s} 
          fill="currentColor" opacity="0.7" 
        />
        
        {/* Side rails for heavier */}
        {s > 0.65 && (
          <>
            <rect x={bodyX} y={bodyY - bodyH * 0.5} width={3 * s} height={bodyH * 1.5} rx={1 * s} fill="currentColor" opacity="0.45" />
            <rect x={bodyX + bodyW - 3 * s} y={bodyY - bodyH * 0.5} width={3 * s} height={bodyH * 1.5} rx={1 * s} fill="currentColor" opacity="0.45" />
          </>
        )}
        
        {/* Wheel */}
        <circle cx={wheelX} cy={wheelY} r={wheelR} stroke="currentColor" strokeWidth={strokeW} fill="none" />
        <circle cx={wheelX} cy={wheelY} r={wheelR * 0.5} stroke="currentColor" strokeWidth={strokeW * 0.5} fill="none" opacity="0.4" />
        <circle cx={wheelX} cy={wheelY} r={wheelR * 0.2} fill="currentColor" />
        
        {/* Fender */}
        <path 
          d={`M${wheelX - wheelR - 3*s} ${bodyY + bodyH} Q${wheelX} ${bodyY} ${wheelX + wheelR + 3*s} ${bodyY + bodyH}`} 
          stroke="currentColor" 
          strokeWidth={strokeW * 0.6} 
          fill="none" 
          opacity="0.5" 
        />
      </svg>
    );
  }

  // Tandem axle trailer
  if (axleCount === 2) {
    const bodyW = 70 * s;
    const bodyH = 20 * s;
    const bodyX = 16 + offsetX;
    const bodyY = 18 + offsetY - bodyH / 2;
    const wheelR = 9 * s;
    const wheelY = 26 + offsetY + bodyH / 2 + wheelR * 0.5;
    const wheel1X = bodyX + bodyW * 0.35;
    const wheel2X = bodyX + bodyW * 0.7;
    const hitchLen = 14 * s;
    const hitchBall = 4 * s;
    const strokeW = 2 + s * 2;
    
    return (
      <svg {...commonProps}>
        {/* A-frame hitch for heavier, straight for lighter */}
        {s > 0.7 ? (
          <>
            <path d={`M${bodyX - hitchLen} ${18 + offsetY} L${bodyX} ${bodyY}`} stroke="currentColor" strokeWidth={strokeW} strokeLinecap="round" />
            <path d={`M${bodyX - hitchLen} ${18 + offsetY} L${bodyX} ${bodyY + bodyH}`} stroke="currentColor" strokeWidth={strokeW} strokeLinecap="round" />
            <circle cx={bodyX - hitchLen} cy={18 + offsetY} r={hitchBall} fill="currentColor" />
          </>
        ) : (
          <>
            <path d={`M${bodyX - hitchLen} ${18 + offsetY} L${bodyX} ${18 + offsetY}`} stroke="currentColor" strokeWidth={strokeW} strokeLinecap="round" />
            <circle cx={bodyX - hitchLen} cy={18 + offsetY} r={hitchBall} fill="currentColor" />
          </>
        )}
        
        {/* Trailer body */}
        <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={2 * s} fill="currentColor" opacity="0.7" />
        
        {/* Side rails */}
        {s > 0.6 && (
          <>
            <rect x={bodyX} y={bodyY - bodyH * 0.6} width={3 * s} height={bodyH * 1.6} rx={1 * s} fill="currentColor" opacity="0.45" />
            <rect x={bodyX + bodyW - 3 * s} y={bodyY - bodyH * 0.6} width={3 * s} height={bodyH * 1.6} rx={1 * s} fill="currentColor" opacity="0.45" />
          </>
        )}
        
        {/* Ramp for heavier */}
        {s > 0.8 && (
          <path d={`M${bodyX + bodyW - 2} ${bodyY + bodyH} L${bodyX + bodyW + 4*s} ${wheelY}`} stroke="currentColor" strokeWidth={strokeW} strokeLinecap="round" opacity="0.6" />
        )}
        
        {/* Wheels */}
        <circle cx={wheel1X} cy={wheelY} r={wheelR} stroke="currentColor" strokeWidth={strokeW} fill="none" />
        <circle cx={wheel1X} cy={wheelY} r={wheelR * 0.5} stroke="currentColor" strokeWidth={strokeW * 0.5} fill="none" opacity="0.4" />
        <circle cx={wheel1X} cy={wheelY} r={wheelR * 0.18} fill="currentColor" />
        
        <circle cx={wheel2X} cy={wheelY} r={wheelR} stroke="currentColor" strokeWidth={strokeW} fill="none" />
        <circle cx={wheel2X} cy={wheelY} r={wheelR * 0.5} stroke="currentColor" strokeWidth={strokeW * 0.5} fill="none" opacity="0.4" />
        <circle cx={wheel2X} cy={wheelY} r={wheelR * 0.18} fill="currentColor" />
        
        {/* Fenders */}
        <path 
          d={`M${wheel1X - wheelR - 2*s} ${bodyY + bodyH} Q${wheel1X} ${bodyY} ${wheel1X + wheelR + 2*s} ${bodyY + bodyH} Q${(wheel1X + wheel2X)/2} ${bodyY} ${wheel2X - wheelR - 2*s} ${bodyY + bodyH} Q${wheel2X} ${bodyY} ${wheel2X + wheelR + 2*s} ${bodyY + bodyH}`} 
          stroke="currentColor" 
          strokeWidth={strokeW * 0.5} 
          fill="none" 
          opacity="0.45" 
        />
      </svg>
    );
  }

  // Triple axle trailer
  const bodyW = 72 * s;
  const bodyH = 20 * s;
  const bodyX = 18 + offsetX;
  const bodyY = 14 + offsetY - bodyH / 2;
  const wheelR = 8 * s;
  const wheelY = 22 + offsetY + bodyH / 2 + wheelR * 0.4;
  const wheel1X = bodyX + bodyW * 0.22;
  const wheel2X = bodyX + bodyW * 0.5;
  const wheel3X = bodyX + bodyW * 0.78;
  const hitchBall = 4 * s;
  const strokeW = 2 + s * 2;
  const gooseneckH = 14 * s;
  
  return (
    <svg {...commonProps}>
      {/* Gooseneck hitch */}
      <path 
        d={`M${bodyX - 10} ${bodyY - gooseneckH + 4} L${bodyX - 10} ${bodyY + 2} L${bodyX} ${bodyY + 2}`} 
        stroke="currentColor" 
        strokeWidth={strokeW + 0.5} 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <circle cx={bodyX - 10} cy={bodyY - gooseneckH + 4} r={hitchBall + 1} fill="currentColor" />
      
      {/* Trailer body */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={2 * s} fill="currentColor" opacity="0.7" />
      
      {/* Tall side rails */}
      <rect x={bodyX} y={bodyY - bodyH * 0.8} width={3 * s} height={bodyH * 1.8} rx={1 * s} fill="currentColor" opacity="0.5" />
      <rect x={bodyX + bodyW - 3 * s} y={bodyY - bodyH * 0.8} width={3 * s} height={bodyH * 1.8} rx={1 * s} fill="currentColor" opacity="0.5" />
      
      {/* Ramp */}
      <path d={`M${bodyX + bodyW - 2} ${bodyY + bodyH} L${bodyX + bodyW + 5*s} ${wheelY}`} stroke="currentColor" strokeWidth={strokeW + 0.5} strokeLinecap="round" opacity="0.65" />
      
      {/* Three wheels */}
      <circle cx={wheel1X} cy={wheelY} r={wheelR} stroke="currentColor" strokeWidth={strokeW * 0.9} fill="none" />
      <circle cx={wheel1X} cy={wheelY} r={wheelR * 0.5} stroke="currentColor" strokeWidth={strokeW * 0.4} fill="none" opacity="0.35" />
      <circle cx={wheel1X} cy={wheelY} r={wheelR * 0.15} fill="currentColor" />
      
      <circle cx={wheel2X} cy={wheelY} r={wheelR} stroke="currentColor" strokeWidth={strokeW * 0.9} fill="none" />
      <circle cx={wheel2X} cy={wheelY} r={wheelR * 0.5} stroke="currentColor" strokeWidth={strokeW * 0.4} fill="none" opacity="0.35" />
      <circle cx={wheel2X} cy={wheelY} r={wheelR * 0.15} fill="currentColor" />
      
      <circle cx={wheel3X} cy={wheelY} r={wheelR} stroke="currentColor" strokeWidth={strokeW * 0.9} fill="none" />
      <circle cx={wheel3X} cy={wheelY} r={wheelR * 0.5} stroke="currentColor" strokeWidth={strokeW * 0.4} fill="none" opacity="0.35" />
      <circle cx={wheel3X} cy={wheelY} r={wheelR * 0.15} fill="currentColor" />
      
      {/* Fenders */}
      <path 
        d={`M${wheel1X - wheelR} ${bodyY + bodyH} Q${wheel1X} ${bodyY + 2} ${wheel1X + wheelR} ${bodyY + bodyH} Q${(wheel1X + wheel2X)/2} ${bodyY + 2} ${wheel2X - wheelR} ${bodyY + bodyH} Q${wheel2X} ${bodyY + 2} ${wheel2X + wheelR} ${bodyY + bodyH} Q${(wheel2X + wheel3X)/2} ${bodyY + 2} ${wheel3X - wheelR} ${bodyY + bodyH} Q${wheel3X} ${bodyY + 2} ${wheel3X + wheelR} ${bodyY + bodyH}`} 
        stroke="currentColor" 
        strokeWidth={strokeW * 0.5} 
        fill="none" 
        opacity="0.45" 
      />
    </svg>
  );
};

// =============================================================================
// CAPACITY CARD COMPONENT
// =============================================================================

const CapacityCard = ({ kit, index, axleType }) => {
  const decimalPlaces = kit.value % 1 !== 0 ? 1 : 0;
  
  // Determine card title based on axle type
  const axleLabels = {
    single: 'Single Axle Kit',
    tandem: 'Tandem Axle Kit',
    triple: 'Triple Axle Kit',
  };
  
  return (
    <BlurFade 
      delay={0.05 * index} 
      direction="up" 
      offset={20} 
      blur="8px" 
      duration={0.4}
    >
      <a href={kit.url} className="tpu-capacity-grid__link">
        <MagicCard
          className="tpu-capacity-grid__card"
          gradientSize={150}
          gradientColor="rgba(255, 107, 53, 0.15)"
          gradientFrom="#ff6b35"
          gradientTo="#ffc107"
          gradientOpacity={0.3}
        >
          <BorderBeam 
            size={60}
            duration={8}
            delay={index * 0.3}
            colorFrom="#ff6b35"
            colorTo="#ffc107"
            borderWidth={2}
          />
          
          <div className="tpu-capacity-grid__card-icon">
            <TrailerIcon capacity={kit.value} axleType={axleType} />
          </div>
          
          <div className="tpu-capacity-grid__card-capacity">
            <NumberTicker
              value={kit.value}
              startValue={0}
              delay={0.1 + index * 0.05}
              decimalPlaces={decimalPlaces}
              suffix="K"
              className="tpu-capacity-grid__number"
            />
          </div>
          
          <div className="tpu-capacity-grid__card-label">
            {axleLabels[axleType]}
          </div>
        </MagicCard>
      </a>
    </BlurFade>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CapacityGrid() {
  // Initialize state from localStorage or default to 'tandem'
  const [selectedAxle, setSelectedAxle] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_AXLE);
      if (saved && KIT_MAP[saved]) {
        return saved;
      }
    }
    return 'tandem';
  });

  // Persist selection to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_AXLE, selectedAxle);
    }
  }, [selectedAxle]);

  // Get current kits for selected axle type
  const currentKits = KIT_MAP[selectedAxle] || KIT_MAP.tandem;

  // Handle axle change
  const handleAxleChange = (newAxle) => {
    setSelectedAxle(newAxle);
  };

  return (
    <section className="tpu-capacity-grid-section">
      <div className="tpu-container">
        {/* Header */}
        <BlurFade delay={0} direction="up" offset={15} blur="6px" duration={0.5}>
          <header className="tpu-capacity-grid__header">
            <TextAnimate
              as="h2"
              className="tpu-capacity-grid__title"
              by="word"
              animation="blurInUp"
              delay={0.1}
              duration={0.6}
              once={true}
            >
              Shop by Capacity
            </TextAnimate>
            
            <p className="tpu-capacity-grid__subtitle">
              <AnimatedGradientText speed={1.5} colorFrom="#ff6b35" colorTo="#ffc107">
                What capacity kit do you need?
              </AnimatedGradientText>
            </p>
          </header>
        </BlurFade>

        {/* Axle Selector */}
        <BlurFade delay={0.1} direction="up" offset={10} blur="4px" duration={0.4}>
          <AxleToggleGroup
            value={selectedAxle}
            onChange={handleAxleChange}
            availableAxles={['single', 'tandem', 'triple']}
          />
        </BlurFade>

        {/* Capacity Grid */}
        <div className="tpu-capacity-grid" key={selectedAxle}>
          {currentKits.map((kit, index) => (
            <CapacityCard 
              key={`${selectedAxle}-${kit.cap}`} 
              kit={kit} 
              index={index} 
              axleType={selectedAxle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CapacityGrid;
