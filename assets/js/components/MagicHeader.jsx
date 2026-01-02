import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import ShimmerButton from './ShimmerButton';
import ScrollProgress from './ScrollProgress';

/**
 * MagicHeader - Enhanced header with Magic UI effects
 * Features: Dock-like nav items, shimmer button, scroll progress
 */
export function MagicHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { scrollY } = useScroll();
    
    // Handle scroll state
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Scroll Progress */}
            <ScrollProgress />
            
            {/* Header */}
            <motion.header
                className={`tpu-magic-header ${isScrolled ? 'tpu-magic-header--scrolled' : ''}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
                <div className="tpu-magic-header__inner">
                    {/* Mobile Menu Toggle */}
                    <motion.button
                        className="tpu-magic-header__menu-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className={`tpu-hamburger ${isMobileMenuOpen ? 'tpu-hamburger--open' : ''}`}>
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                            />
                        </div>
                    </motion.button>

                    {/* Logo placeholder - will be replaced by actual logo */}
                    <div className="tpu-magic-header__logo">
                        <span style={{ 
                            fontFamily: 'Oswald, sans-serif', 
                            fontSize: '1.25rem', 
                            fontWeight: 700,
                            color: '#f5f5f5',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            whiteSpace: 'nowrap'
                        }}>
                            Trailer Parts Unlimited
                        </span>
                        <a 
                            href="tel:844-898-8687" 
                            className="tpu-magic-header__phone"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginTop: '4px',
                                fontFamily: 'Source Sans 3, sans-serif',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                color: '#ff6b35',
                                textDecoration: 'none',
                                letterSpacing: '0.02em',
                                transition: 'color 0.2s ease'
                            }}
                        >
                            <svg 
                                width="14" 
                                height="14" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            844-898-8687
                        </a>
                    </div>

                    {/* Desktop Navigation with Dock Effect */}
                    <DockNav />

                    {/* Action Buttons */}
                    <div className="tpu-magic-header__actions">
                        <ActionButton 
                            icon="search" 
                            label="Search"
                            onClick={() => setIsSearchOpen(true)}
                        />
                        <ActionButton icon="user" label="Account" href="/login.php" />
                        <ActionButton icon="cart" label="Cart" href="/cart.php" badge={0} />
                    </div>
                </div>
            </motion.header>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <SearchOverlay onClose={() => setIsSearchOpen(false)} />
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
                )}
            </AnimatePresence>
        </>
    );
}

/**
 * DockNav - Navigation with dropdown menus
 */
function DockNav() {
    const [activeDropdown, setActiveDropdown] = useState(null);
    
    const navItems = [
        { 
            label: 'Axles', 
            href: '/axles/',
            children: [
                { label: 'Trailer Axles', href: '/axles/trailer-axles/' },
                { label: 'Axle Kits', href: '/axles/axle-kits/' },
                { label: 'Spindles', href: '/axles/spindles/' },
                { label: 'Hubs & Drums', href: '/axles/hubs-drums/' },
            ]
        },
        { 
            label: 'Brakes', 
            href: '/brakes/',
            children: [
                { label: 'Electric Brakes', href: '/brakes/electric/' },
                { label: 'Hydraulic Brakes', href: '/brakes/hydraulic/' },
                { label: 'Brake Parts', href: '/brakes/parts/' },
                { label: 'Brake Controllers', href: '/brakes/controllers/' },
            ]
        },
        { 
            label: 'Lights', 
            href: '/lights/',
            children: [
                { label: 'LED Lights', href: '/lights/led/' },
                { label: 'Tail Lights', href: '/lights/tail/' },
                { label: 'Marker Lights', href: '/lights/marker/' },
                { label: 'Light Kits', href: '/lights/kits/' },
            ]
        },
        { 
            label: 'Wiring', 
            href: '/wiring/',
            children: [
                { label: 'Connectors', href: '/wiring/connectors/' },
                { label: 'Wire Harnesses', href: '/wiring/harnesses/' },
                { label: 'Adapters', href: '/wiring/adapters/' },
            ]
        },
        { 
            label: 'Couplers', 
            href: '/couplers/',
            children: [
                { label: 'Ball Couplers', href: '/couplers/ball/' },
                { label: 'Pintle Hooks', href: '/couplers/pintle/' },
                { label: 'Jacks', href: '/couplers/jacks/' },
            ]
        },
        { label: 'Brands', href: '/brands/' },
    ];

    return (
        <nav className="tpu-dock-nav">
            {navItems.map((item, index) => (
                <NavItem
                    key={item.label}
                    item={item}
                    isActive={activeDropdown === index}
                    onMouseEnter={() => setActiveDropdown(index)}
                    onMouseLeave={() => setActiveDropdown(null)}
                />
            ))}
        </nav>
    );
}

function NavItem({ item, isActive, onMouseEnter, onMouseLeave }) {
    return (
        <div 
            className="tpu-nav-item-wrapper"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <motion.a
                href={item.href}
                className="tpu-dock-nav__item"
                whileHover={{ color: '#ff6b35' }}
                whileTap={{ scale: 0.95 }}
            >
                {item.label}
                {item.children && (
                    <motion.svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ marginLeft: '4px' }}
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </motion.svg>
                )}
            </motion.a>
            
            {/* Dropdown Menu */}
            <AnimatePresence>
                {isActive && item.children && (
                    <motion.div
                        className="tpu-dropdown-menu"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                    >
                        {item.children.map((child, idx) => (
                            <motion.a
                                key={child.label}
                                href={child.href}
                                className="tpu-dropdown-menu__item"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                whileHover={{ 
                                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                                    x: 4
                                }}
                            >
                                {child.label}
                            </motion.a>
                        ))}
                        <div className="tpu-dropdown-menu__footer">
                            <a href={item.href} className="tpu-dropdown-menu__view-all">
                                View All {item.label}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * ActionButton - Icon button with hover effects
 */
function ActionButton({ icon, label, href, onClick, badge }) {
    const icons = {
        search: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>
        ),
        user: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        cart: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
        ),
    };

    const Component = href ? motion.a : motion.button;
    const props = href ? { href } : { onClick };

    return (
        <Component
            className="tpu-action-btn"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 107, 53, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            aria-label={label}
            {...props}
        >
            {icons[icon]}
            {badge !== undefined && badge > 0 && (
                <motion.span
                    className="tpu-action-btn__badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                >
                    {badge}
                </motion.span>
            )}
        </Component>
    );
}

/**
 * SearchOverlay - Full screen search with animation
 */
function SearchOverlay({ onClose }) {
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
        const handleEsc = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <motion.div
            className="tpu-search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="tpu-search-overlay__content"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={(e) => e.stopPropagation()}
            >
                <form action="/search.php" method="GET">
                    <input
                        ref={inputRef}
                        type="search"
                        name="search_query"
                        placeholder="Search for trailer parts..."
                        className="tpu-search-overlay__input"
                    />
                </form>
                <button className="tpu-search-overlay__close" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </motion.div>
        </motion.div>
    );
}

/**
 * MobileMenu - Animated mobile navigation drawer
 */
function MobileMenu({ onClose }) {
    const menuItems = [
        { label: 'Axles & Hubs', href: '/axles/' },
        { label: 'Brakes', href: '/brakes/' },
        { label: 'Trailer Lights', href: '/lights/' },
        { label: 'Wiring & Electrical', href: '/wiring/' },
        { label: 'Couplers & Hitches', href: '/couplers/' },
        { label: 'Brands', href: '/brands/' },
    ];

    return (
        <motion.div
            className="tpu-mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.nav
                className="tpu-mobile-menu"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="tpu-mobile-menu__header">
                    <span style={{ fontFamily: 'Oswald', fontWeight: 700 }}>MENU</span>
                    <button onClick={onClose} className="tpu-mobile-menu__close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <ul className="tpu-mobile-menu__list">
                    {menuItems.map((item, index) => (
                        <motion.li
                            key={item.label}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <a href={item.href} className="tpu-mobile-menu__link">
                                {item.label}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </a>
                        </motion.li>
                    ))}
                </ul>
                <div className="tpu-mobile-menu__cta">
                    <ShimmerButton href="/search.php" style={{ width: '100%' }}>
                        Parts Finder
                    </ShimmerButton>
                </div>
            </motion.nav>
        </motion.div>
    );
}

export default MagicHeader;

