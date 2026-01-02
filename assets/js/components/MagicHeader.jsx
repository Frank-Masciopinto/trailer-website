import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import ShimmerButton from './ShimmerButton';
import ScrollProgress from './ScrollProgress';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from './ui/NavigationMenu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetTrigger,
} from './ui/Sheet';

/**
 * MagicHeader - Enhanced header with Magic UI effects
 * Features: Dock-like nav items, shimmer button, scroll progress
 */
export function MagicHeader({ initialCartQuantity = 0 }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(initialCartQuantity);
    const { scrollY } = useScroll();
    
    // Handle scroll state
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Listen for cart updates from BigCommerce
    useEffect(() => {
        // Update cart quantity when cart-quantity-update event is fired
        const handleCartUpdate = (event) => {
            if (event.detail && typeof event.detail.quantity === 'number') {
                setCartQuantity(event.detail.quantity);
            }
        };
        
        // Watch for changes to the .cart-quantity element in the regular header
        const cartQuantityElement = document.querySelector('.cart-quantity');
        if (cartQuantityElement) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        const newQuantity = parseInt(cartQuantityElement.textContent, 10) || 0;
                        setCartQuantity(newQuantity);
                    }
                });
            });
            observer.observe(cartQuantityElement, { 
                childList: true, 
                characterData: true, 
                subtree: true 
            });
            
            // Also check initial value from DOM
            const initialFromDom = parseInt(cartQuantityElement.textContent, 10) || 0;
            if (initialFromDom > 0) {
                setCartQuantity(initialFromDom);
            }
            
            return () => observer.disconnect();
        }
        
        // Listen for custom cart update event
        document.addEventListener('cart-quantity-update', handleCartUpdate);
        return () => document.removeEventListener('cart-quantity-update', handleCartUpdate);
    }, []);

    return (
        <>
            {/* Scroll Progress */}
            <ScrollProgress />
            
            {/* Mobile Menu Sheet */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            
            {/* Header */}
            <motion.header
                className={`tpu-magic-header ${isScrolled ? 'tpu-magic-header--scrolled' : ''}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
                <div className="tpu-magic-header__inner">
                    {/* Mobile Menu Toggle - Sheet Trigger */}
                    <SheetTrigger asChild>
                        <motion.button
                            className="tpu-magic-header__menu-toggle"
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
                    </SheetTrigger>

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
                            icon="phone" 
                            label="Call Us: 844-898-8687"
                            href="tel:844-898-8687"
                        />
                        <ActionButton 
                            icon="search" 
                            label="Search"
                            onClick={() => setIsSearchOpen(true)}
                        />
                        <ActionButton icon="user" label="Account" href="/login.php" />
                        <ActionButton icon="cart" label="Cart" href="/cart.php" badge={cartQuantity} />
                    </div>
                </div>
            </motion.header>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <SearchOverlay onClose={() => setIsSearchOpen(false)} />
                )}
            </AnimatePresence>

            {/* Mobile Menu - Sheet Content */}
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <SidebarNav />
                <SheetFooter>
                    <ShimmerButton href="/search.php" style={{ width: '100%' }}>
                        Parts Finder
                    </ShimmerButton>
                </SheetFooter>
            </SheetContent>
            </Sheet>
        </>
    );
}

/**
 * DockNav - Navigation Menu using shadcn/Radix UI
 */
function DockNav() {
    const navItems = [
        { 
            label: 'Axles', 
            href: '/axles/',
            children: [
                { label: 'Trailer Axles', href: '/axles/trailer-axles/', description: 'Complete axle assemblies for trailers' },
                { label: 'Axle Kits', href: '/axles/axle-kits/', description: 'DIY axle kit packages' },
                { label: 'Spindles', href: '/axles/spindles/', description: 'Replacement spindles and parts' },
                { label: 'Hubs & Drums', href: '/axles/hubs-drums/', description: 'Hub assemblies and brake drums' },
            ]
        },
        { 
            label: 'Brakes', 
            href: '/brakes/',
            children: [
                { label: 'Electric Brakes', href: '/brakes/electric/', description: 'Electric brake assemblies' },
                { label: 'Hydraulic Brakes', href: '/brakes/hydraulic/', description: 'Disc and drum hydraulic brakes' },
                { label: 'Brake Parts', href: '/brakes/parts/', description: 'Pads, shoes, and hardware' },
                { label: 'Brake Controllers', href: '/brakes/controllers/', description: 'In-cab brake controllers' },
            ]
        },
        { 
            label: 'Lights', 
            href: '/lights/',
            children: [
                { label: 'LED Lights', href: '/lights/led/', description: 'Energy-efficient LED solutions' },
                { label: 'Tail Lights', href: '/lights/tail/', description: 'Stop, turn, and tail lights' },
                { label: 'Marker Lights', href: '/lights/marker/', description: 'Clearance and side markers' },
                { label: 'Light Kits', href: '/lights/kits/', description: 'Complete lighting packages' },
            ]
        },
        { 
            label: 'Wiring', 
            href: '/wiring/',
            children: [
                { label: 'Connectors', href: '/wiring/connectors/', description: 'Plugs and receptacles' },
                { label: 'Wire Harnesses', href: '/wiring/harnesses/', description: 'Pre-wired harness kits' },
                { label: 'Adapters', href: '/wiring/adapters/', description: 'Connector adapters' },
            ]
        },
        { 
            label: 'Couplers', 
            href: '/couplers/',
            children: [
                { label: 'Ball Couplers', href: '/couplers/ball/', description: 'Standard ball hitches' },
                { label: 'Pintle Hooks', href: '/couplers/pintle/', description: 'Heavy-duty pintle hitches' },
                { label: 'Jacks', href: '/couplers/jacks/', description: 'Tongue and stabilizer jacks' },
            ]
        },
        { label: 'Brands', href: '/brands/' },
    ];

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {navItems.map((item) => (
                    <NavigationMenuItem key={item.label}>
                        {item.children ? (
                            <>
                                <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="tpu-nav-content-grid tpu-nav-content-grid--2cols">
                                        {item.children.map((child) => (
                                            <NavigationMenuLink key={child.label} asChild>
                                                <a href={child.href} className="tpu-nav-content-item">
                                                    <div className="tpu-nav-content-item__title">{child.label}</div>
                                                    <p className="tpu-nav-content-item__description">{child.description}</p>
                                                </a>
                                            </NavigationMenuLink>
                                        ))}
                                    </div>
                                    <div className="tpu-nav-content-footer">
                                        <a href={item.href}>
                                            View All {item.label}
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    </div>
                                </NavigationMenuContent>
                            </>
                        ) : (
                            <NavigationMenuLink asChild>
                                <a href={item.href} className="tpu-nav-menu__link">{item.label}</a>
                            </NavigationMenuLink>
                        )}
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

/**
 * ActionButton - Icon button with hover effects
 */
function ActionButton({ icon, label, href, onClick, badge }) {
    const icons = {
        phone: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
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
 * SidebarNav - Navigation items for the mobile Sheet sidebar
 */
function SidebarNav() {
    const menuItems = [
        { label: 'Axles & Hubs', href: '/axles/', icon: 'wheel' },
        { label: 'Brakes', href: '/brakes/', icon: 'brake' },
        { label: 'Trailer Lights', href: '/lights/', icon: 'light' },
        { label: 'Wiring & Electrical', href: '/wiring/', icon: 'electric' },
        { label: 'Couplers & Hitches', href: '/couplers/', icon: 'coupler' },
        { label: 'Brands', href: '/brands/', icon: 'brand' },
    ];

    const icons = {
        wheel: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
        brake: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>
        ),
        light: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18h6M10 22h4M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
        ),
        electric: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
        ),
        coupler: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v4M10 1v4M14 1v4" />
            </svg>
        ),
        brand: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
        ),
        arrow: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
            </svg>
        ),
    };

    return (
        <nav className="tpu-sidebar-nav">
            <ul className="tpu-sidebar-nav__list">
                {menuItems.map((item) => (
                    <li key={item.label} className="tpu-sidebar-nav__item">
                        <a href={item.href} className="tpu-sidebar-nav__link">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ width: '20px', height: '20px', color: '#ff6b35' }}>
                                    {icons[item.icon]}
                                </span>
                                {item.label}
                            </span>
                            {icons.arrow}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default MagicHeader;

