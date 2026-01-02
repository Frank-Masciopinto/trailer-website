import React from 'react';
import { BlurFade } from './BlurFade';

// Category data for the bento grid
const categories = [
  {
    id: 'axles',
    title: 'Axles & Hubs',
    description: 'Complete axle assemblies, hub kits, and bearings for all trailer types.',
    href: '/axles-hubs',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    size: 'lg',
    badge: 'Best Seller',
    gradient: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
  },
  {
    id: 'lights',
    title: 'Trailer Lights',
    description: 'LED and incandescent lighting solutions.',
    href: '/trailer-lights',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18h6M10 22h4M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #3f3f46 0%, #2d2d2d 100%)',
  },
  {
    id: 'brakes',
    title: 'Brakes',
    description: 'Electric and hydraulic brake systems.',
    href: '/brakes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    id: 'couplers',
    title: 'Couplers & Hitches',
    description: 'Ball couplers, pintle hooks, and more.',
    href: '/couplers',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v4M10 1v4M14 1v4" />
      </svg>
    ),
  },
  {
    id: 'dexter',
    title: 'Dexter Axle',
    description: "America's leading trailer axle manufacturer. Quality you can trust.",
    href: '/brands/dexter',
    size: 'tall',
    badge: 'Featured Brand',
    gradient: 'linear-gradient(180deg, #ff6b35 0%, #1a1a1a 100%)',
    linkText: 'View Collection',
  },
  {
    id: 'wiring',
    title: 'Wiring & Electrical',
    description: 'Connectors, wiring harnesses, and electrical components for reliable trailer connections.',
    href: '/wiring',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    size: 'wide',
    gradient: 'linear-gradient(90deg, #2d2d2d 0%, #3f3f46 50%, #2d2d2d 100%)',
  },
];

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const BentoCard = ({ category, index }) => {
  const sizeClass = category.size ? `tpu-bento__card--${category.size}` : '';
  
  return (
    <BlurFade
      delay={0.1 * index}
      direction="up"
      offset={20}
      blur="8px"
      duration={0.5}
    >
      <article className={`tpu-bento__card ${sizeClass}`}>
        {category.gradient && (
          <div className="tpu-bento__image">
            <div style={{ width: '100%', height: '100%', background: category.gradient }} />
            <div className="tpu-bento__overlay" />
          </div>
        )}
        <div className="tpu-bento__content">
          {category.icon && <div className="tpu-bento__icon">{category.icon}</div>}
          <h3 className="tpu-bento__title">{category.title}</h3>
          <p className="tpu-bento__description">{category.description}</p>
          <a href={category.href} className="tpu-bento__link">
            {category.linkText || 'Shop Now'}
            <ArrowIcon />
          </a>
        </div>
        {category.badge && <span className="tpu-bento__badge">{category.badge}</span>}
      </article>
    </BlurFade>
  );
};

export function AnimatedBentoGrid() {
  return (
    <section className="tpu-bento-section">
      <div className="tpu-container">
        <BlurFade delay={0} direction="up" offset={15} blur="6px">
          <div className="tpu-bento-section__header">
            <h2 className="tpu-bento-section__title">Shop by Category</h2>
            <p className="tpu-bento-section__subtitle">
              Everything you need to keep your trailer running strong
            </p>
          </div>
        </BlurFade>

        <div className="tpu-bento">
          {categories.map((category, index) => (
            <BentoCard key={category.id} category={category} index={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default AnimatedBentoGrid;

