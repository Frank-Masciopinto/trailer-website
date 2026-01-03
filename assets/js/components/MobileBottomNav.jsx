import React from 'react';
import { motion } from 'motion/react';
import { Dock, DockIcon } from './Dock';

/**
 * MobileBottomNav - Apple-style bottom navigation using MagicUI Dock
 * Only visible on mobile devices, always visible (no hide on scroll)
 */
export function MobileBottomNav({ cartQuantity = 0, onSearchClick, phoneNumber = '1-800-998-5609' }) {
  const navItems = [
    {
      id: 'phone',
      label: 'Call',
      href: `tel:${phoneNumber.replace(/[^0-9+]/g, '')}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      id: 'search',
      label: 'Search',
      href: null,
      onClick: onSearchClick,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      ),
    },
    {
      id: 'categories',
      label: 'Shop',
      href: '/trailer-axle-kits-1/',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: 'cart',
      label: 'Cart',
      href: '/cart.php',
      badge: cartQuantity,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
    },
    {
      id: 'account',
      label: 'Account',
      href: '/login.php',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <motion.nav
      className="tpu-bottom-dock"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Dock
        iconSize={44}
        iconMagnification={64}
        iconDistance={100}
        direction="middle"
      >
        {navItems.map((item) => (
          <DockIcon key={item.id}>
            {item.href ? (
              <a
                href={item.href}
                className="tpu-bottom-dock__item"
                aria-label={item.label}
              >
                <span className="tpu-bottom-dock__icon">
                  {item.icon}
                </span>
                <span className="tpu-bottom-dock__label">{item.label}</span>
                {item.badge > 0 && (
                  <span className="tpu-bottom-dock__badge">{item.badge}</span>
                )}
              </a>
            ) : (
              <button
                type="button"
                className="tpu-bottom-dock__item"
                onClick={item.onClick}
                aria-label={item.label}
              >
                <span className="tpu-bottom-dock__icon">
                  {item.icon}
                </span>
                <span className="tpu-bottom-dock__label">{item.label}</span>
              </button>
            )}
          </DockIcon>
        ))}
      </Dock>
    </motion.nav>
  );
}

export default MobileBottomNav;


