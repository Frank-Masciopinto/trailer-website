import React from 'react';
import { motion, useInView } from 'motion/react';
import { BlurFade } from './BlurFade';
import { TextAnimate } from './TextAnimate';
import { AnimatedGradientText } from './AnimatedGradientText';
import { ShimmerButton } from './ShimmerButton';

// Icon components
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="tpu-kits__check-icon">
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const RefreshCwIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 21h5v-5" />
  </svg>
);

const DollarSignIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 17h4V5H2v12h3" />
    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

const AnchorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <line x1="12" y1="22" x2="12" y2="8" />
    <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
  </svg>
);

// Value proposition cards data
const valueCards = [
  {
    id: 'fitment',
    icon: TargetIcon,
    title: 'Guaranteed Fitment',
    description: 'Matched by axle capacity, bearing & seal size, bolt pattern, and brake type',
    accentColor: '#22c55e',
  },
  {
    id: 'cycles',
    icon: RefreshCwIcon,
    title: 'Built Around Failure Cycles',
    description: 'Bearings, brakes, lights, and tires — replaced together, the right way',
    accentColor: '#ff6b35',
  },
  {
    id: 'savings',
    icon: DollarSignIcon,
    title: 'Save Time & Money',
    description: 'Up to 15–20% less than buying parts individually',
    accentColor: '#ffc107',
  },
];

// Trust badges data
const trustBadges = [
  {
    id: 'accuracy',
    icon: ShieldCheckIcon,
    text: '99%+ fitment accuracy',
  },
  {
    id: 'materials',
    icon: AnchorIcon,
    text: 'Marine-grade SS & galvanized options',
  },
  {
    id: 'shipping',
    icon: TruckIcon,
    text: 'U.S. & Canada shipping',
  },
];

// Value Card Component with Magic effects
const ValueCard = ({ card, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const IconComponent = card.icon;

  return (
    <BlurFade delay={0.15 * index} direction="up" offset={25} blur="10px" duration={0.6}>
      <motion.article
        ref={ref}
        className="tpu-kits__card"
        style={{ '--card-accent': card.accentColor }}
        whileHover={{ 
          y: -8, 
          scale: 1.02,
          transition: { duration: 0.3, ease: 'easeOut' }
        }}
      >
        {/* Glow effect on hover */}
        <div className="tpu-kits__card-glow" />
        
        {/* Border beam effect */}
        <div className="tpu-kits__card-beam" />
        
        {/* Card content */}
        <div className="tpu-kits__card-inner">
          <div className="tpu-kits__card-icon">
            <IconComponent />
          </div>
          
          <div className="tpu-kits__card-check">
            <CheckIcon />
          </div>
          
          <h3 className="tpu-kits__card-title">{card.title}</h3>
          <p className="tpu-kits__card-description">{card.description}</p>
        </div>
      </motion.article>
    </BlurFade>
  );
};

// Trust Badge Component
const TrustBadge = ({ badge, index }) => {
  const IconComponent = badge.icon;
  
  return (
    <BlurFade delay={0.4 + 0.1 * index} direction="up" offset={15} blur="6px" duration={0.5}>
      <motion.div 
        className="tpu-kits__badge"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <span className="tpu-kits__badge-icon">
          <IconComponent />
        </span>
        <span className="tpu-kits__badge-text">{badge.text}</span>
      </motion.div>
    </BlurFade>
  );
};

// Main Component
export function WhyKitsBeatParts() {
  return (
    <section className="tpu-kits-section">
      {/* Background effects */}
      <div className="tpu-kits__bg">
        <div className="tpu-kits__bg-gradient" />
        <div className="tpu-kits__bg-grid" />
        <div className="tpu-kits__bg-noise" />
      </div>
      
      <div className="tpu-container">
        {/* Header */}
        <BlurFade delay={0} direction="up" offset={20} blur="8px" duration={0.6}>
          <header className="tpu-kits__header">
            <span className="tpu-kits__eyebrow">
              <AnimatedGradientText speed={1.5} colorFrom="#ff6b35" colorTo="#ffc107">
                Carter Trailer Kits
              </AnimatedGradientText>
            </span>
            
            <TextAnimate
              as="h2"
              className="tpu-kits__headline"
              by="word"
              animation="blurInUp"
              delay={0.1}
              duration={0.7}
              once={true}
            >
              Everything You Need. Nothing You Don't.
            </TextAnimate>
            
            <p className="tpu-kits__subhead">
              Our pre-built kits eliminate guesswork, missed parts, and repeat shipping.
            </p>
          </header>
        </BlurFade>

        {/* Value Stack - 3 Column Grid */}
        <div className="tpu-kits__grid">
          {valueCards.map((card, index) => (
            <ValueCard key={card.id} card={card} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <BlurFade delay={0.35} direction="up" offset={15} blur="6px" duration={0.5}>
          <div className="tpu-kits__cta">
            <ShimmerButton
              href="/trailer-kits/"
              shimmerColor="#ffffff"
              background="linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)"
              borderRadius="12px"
              className="tpu-kits__cta-btn"
            >
              Shop Trailer Kits
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tpu-kits__arrow">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ShimmerButton>
          </div>
        </BlurFade>

        {/* Trust Badges */}
        <div className="tpu-kits__badges">
          {trustBadges.map((badge, index) => (
            <TrustBadge key={badge.id} badge={badge} index={index} />
          ))}
        </div>

        {/* Carter Brand Callout */}
        <BlurFade delay={0.6} direction="up" offset={20} blur="8px" duration={0.6}>
          <div className="tpu-kits__brand-callout">
            <div className="tpu-kits__brand-content">
              <span className="tpu-kits__brand-badge">Featured Brand</span>
              <h3 className="tpu-kits__brand-name">
                <AnimatedGradientText speed={2} colorFrom="#ff6b35" colorTo="#ffc107">
                  Carter
                </AnimatedGradientText>
              </h3>
              <p className="tpu-kits__brand-tagline">
                Engineered for reliability. Built for the long haul.
              </p>
              <a href="/brands/carter" className="tpu-kits__brand-link">
                Explore Carter Products
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
            <div className="tpu-kits__brand-visual">
              <div className="tpu-kits__brand-orb" />
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

export default WhyKitsBeatParts;

