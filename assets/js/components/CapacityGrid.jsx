import React from 'react';
import { BlurFade } from './BlurFade';
import { TextAnimate } from './TextAnimate';
import { AnimatedGradientText } from './AnimatedGradientText';
import { MagicCard } from './MagicCard';
import { BorderBeam } from './BorderBeam';
import { NumberTicker } from './NumberTicker';

// Capacity data with URLs
const capacities = [
  {
    id: '3.5k',
    value: 3.5,
    label: 'K',
    title: 'Trailer Kits',
    href: '/categories/axles/single-axle-kits/3-5k-single-axle-kits.html',
  },
  {
    id: '5.2k',
    value: 5.2,
    label: 'K',
    title: 'Trailer Kits',
    href: '/categories/axles/single-axle-kits/5-2k-single-axle-kits.html',
  },
  {
    id: '6k',
    value: 6,
    label: 'K',
    title: 'Trailer Kits',
    href: '/categories/axles/single-axle-kits/6k-single-axle-kits.html',
  },
  {
    id: '7k',
    value: 7,
    label: 'K',
    title: 'Trailer Kits',
    href: '/categories/axles/7k-single-axle-kits.html',
  },
  {
    id: '8k',
    value: 8,
    label: 'K',
    title: 'Trailer Kits',
    href: '/8k-single-axle-trailer-kit/',
  },
  {
    id: '12k',
    value: 12,
    label: 'K',
    title: 'Trailer Kits',
    href: '/12k-single-axle-trailer-kit/',
  },
];

// Axle Icon SVG
const AxleIcon = () => (
  <svg 
    viewBox="0 0 100 60" 
    fill="none" 
    className="tpu-capacity-grid__icon"
  >
    {/* Axle tube */}
    <rect x="10" y="26" width="80" height="8" rx="4" fill="currentColor" opacity="0.3" />
    
    {/* Left wheel */}
    <circle cx="15" cy="30" r="14" stroke="currentColor" strokeWidth="3" fill="none" />
    <circle cx="15" cy="30" r="8" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
    <circle cx="15" cy="30" r="3" fill="currentColor" />
    
    {/* Right wheel */}
    <circle cx="85" cy="30" r="14" stroke="currentColor" strokeWidth="3" fill="none" />
    <circle cx="85" cy="30" r="8" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
    <circle cx="85" cy="30" r="3" fill="currentColor" />
    
    {/* Spring leaves */}
    <path d="M25 20 Q50 12 75 20" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M28 16 Q50 10 72 16" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
  </svg>
);

// Capacity Card Component
const CapacityCard = ({ capacity, index }) => {
  const decimalPlaces = capacity.value % 1 !== 0 ? 1 : 0;
  
  return (
    <BlurFade 
      delay={0.1 * index} 
      direction="up" 
      offset={20} 
      blur="8px" 
      duration={0.5}
    >
      <a href={capacity.href} className="tpu-capacity-grid__link">
        <MagicCard
          className="tpu-capacity-grid__card"
          gradientSize={150}
          gradientColor="rgba(255, 107, 53, 0.15)"
          gradientFrom="#ff6b35"
          gradientTo="#ffc107"
          gradientOpacity={0.3}
        >
          {/* Border beam effect */}
          <BorderBeam 
            size={60}
            duration={8}
            delay={index * 0.5}
            colorFrom="#ff6b35"
            colorTo="#ffc107"
            borderWidth={2}
          />
          
          {/* Icon */}
          <div className="tpu-capacity-grid__card-icon">
            <AxleIcon />
          </div>
          
          {/* Capacity number with animated ticker */}
          <div className="tpu-capacity-grid__card-capacity">
            <NumberTicker
              value={capacity.value}
              startValue={0}
              delay={0.2 + index * 0.1}
              decimalPlaces={decimalPlaces}
              suffix={capacity.label}
              className="tpu-capacity-grid__number"
            />
          </div>
          
          {/* Label */}
          <div className="tpu-capacity-grid__card-label">
            {capacity.title}
          </div>
        </MagicCard>
      </a>
    </BlurFade>
  );
};

// Main Component
export function CapacityGrid() {
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

        {/* Capacity Grid */}
        <div className="tpu-capacity-grid">
          {capacities.map((capacity, index) => (
            <CapacityCard key={capacity.id} capacity={capacity} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CapacityGrid;

