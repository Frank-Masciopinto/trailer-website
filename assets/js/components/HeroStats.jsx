import React from 'react';
import { motion } from 'motion/react';
import { CountUpWithGradient } from './CountUpWithGradient';

/**
 * HeroStats - Animated stats section with CountUp and gradient effects
 * Replaces the static Handlebars stats-bar with animated React components
 */
export function HeroStats() {
  const stats = [
    {
      value: 50000,
      suffix: '+',
      label: 'Parts in Stock',
      delay: 0,
    },
    {
      value: 25,
      suffix: '+',
      label: 'Years Experience',
      delay: 0.1,
    },
    {
      value: 100,
      suffix: '%',
      label: 'Satisfaction Guarantee',
      delay: 0.2,
    },
  ];

  return (
    <div className="tpu-stats">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="tpu-stat__item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: stat.delay + 0.3,
            ease: [0.25, 0.4, 0.25, 1],
          }}
        >
          <div className="tpu-stat__number">
            <CountUpWithGradient
              end={stat.value}
              suffix={stat.suffix}
              duration={2.5}
              scrollSpyDelay={100 * index}
              from="#FF6B35"
              via="#FFB347"
              to="#FF8C42"
              gradientSpeed={4}
            />
          </div>
          <span className="tpu-stat__label">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default HeroStats;

