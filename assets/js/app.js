__webpack_public_path__ = window.__webpack_public_path__; // eslint-disable-line

import Global from './theme/global';

// React imports for Magic UI components
import React from 'react';
import { createRoot } from 'react-dom/client';
import MagicHeader from './components/MagicHeader';
import LaserFlow from './components/LaserFlow';
import AnimatedBentoGrid from './components/AnimatedBentoGrid';
import HeroStats from './components/HeroStats';
import GoogleReviews from './components/GoogleReviews';
import { initializeLensImagesLazy } from './components/LensInitializer';
import { initializeLightRaysLazy } from './components/LightRaysInitializer';

const getAccount = () => import('./theme/account');
const getLogin = () => import('./theme/auth');
const noop = null;

const pageClasses = {
    account_orderstatus: getAccount,
    account_order: getAccount,
    account_addressbook: getAccount,
    shippingaddressform: getAccount,
    account_new_return: getAccount,
    'add-wishlist': () => import('./theme/wishlist'),
    account_recentitems: getAccount,
    account_downloaditem: getAccount,
    editaccount: getAccount,
    account_inbox: getAccount,
    account_saved_return: getAccount,
    account_returns: getAccount,
    account_paymentmethods: getAccount,
    account_addpaymentmethod: getAccount,
    account_editpaymentmethod: getAccount,
    login: getLogin,
    createaccount_thanks: getLogin,
    createaccount: getLogin,
    getnewpassword: getLogin,
    forgotpassword: getLogin,
    blog: noop,
    blog_post: noop,
    brand: () => import('./theme/brand'),
    brands: noop,
    cart: () => import('./theme/cart'),
    category: () => import('./theme/category'),
    compare: () => import('./theme/compare'),
    page_contact_form: () => import('./theme/contact-us'),
    error: noop,
    404: noop,
    giftcertificates: () => import('./theme/gift-certificate'),
    giftcertificates_balance: () => import('./theme/gift-certificate'),
    giftcertificates_redeem: () => import('./theme/gift-certificate'),
    default: noop,
    page: noop,
    product: () => import('./theme/product'),
    amp_product_options: () => import('./theme/product'),
    search: () => import('./theme/search'),
    rss: noop,
    sitemap: noop,
    newsletter_subscribe: noop,
    wishlist: () => import('./theme/wishlist'),
    wishlists: () => import('./theme/wishlist'),
};

const customClasses = {};

/**
 * This function gets added to the global window and then called
 * on page load with the current template loaded and JS Context passed in
 * @param pageType String
 * @param contextJSON
 * @returns {*}
 */
window.stencilBootstrap = function stencilBootstrap(pageType, contextJSON = null, loadGlobal = true) {
    const context = JSON.parse(contextJSON || '{}');

    return {
        load() {
            $(() => {
                // Load globals
                if (loadGlobal) {
                    Global.load(context);
                }
                
                // Render Magic UI React header on homepage
                const magicHeaderContainer = document.getElementById('magic-header-root');
                if (magicHeaderContainer && pageType === 'default') {
                    const root = createRoot(magicHeaderContainer);
                    root.render(React.createElement(MagicHeader, {
                        initialCartQuantity: context.cartQuantity || 0
                    }));
                }
                
                // Render LaserFlow background in hero section on homepage
                const laserFlowContainer = document.getElementById('hero-laser-flow-root');
                if (laserFlowContainer && pageType === 'default') {
                    const laserRoot = createRoot(laserFlowContainer);
                    // Adjust settings based on viewport width
                    const isMobile = window.innerWidth < 768;
                    laserRoot.render(React.createElement(LaserFlow, {
                        color: '#FF6B35',
                        verticalBeamOffset: isMobile ? 0.25 : -0.35, // Move beam up on mobile
                        horizontalBeamOffset: 0.0,
                        verticalSizing: isMobile ? 1.0 : 2.5, // Reduce vertical stretch on mobile
                        horizontalSizing: isMobile ? 1.0 : 0.6,
                        fogIntensity: isMobile ? 0.7 : 0.5,
                        wispIntensity: isMobile ? 8.0 : 4.0, // More visible wisps on mobile
                        flowSpeed: 0.3,
                        wispDensity: isMobile ? 1.5 : 1.0 // More wisps on mobile
                    }));
                }
                
                // Render animated Bento Grid with scroll animations on homepage
                const bentoContainer = document.getElementById('animated-bento-root');
                if (bentoContainer && pageType === 'default') {
                    const bentoRoot = createRoot(bentoContainer);
                    bentoRoot.render(React.createElement(AnimatedBentoGrid));
                }
                
                // Render HeroStats with CountUp and Gradient on homepage
                const heroStatsContainer = document.getElementById('hero-stats-root');
                if (heroStatsContainer && pageType === 'default') {
                    const statsRoot = createRoot(heroStatsContainer);
                    statsRoot.render(React.createElement(HeroStats));
                }
                
                // Render Google Reviews section with MagicUI components
                const googleReviewsContainer = document.getElementById('google-reviews-root');
                if (googleReviewsContainer && pageType === 'default') {
                    const reviewsRoot = createRoot(googleReviewsContainer);
                    reviewsRoot.render(React.createElement(GoogleReviews));
                }
                
                // Initialize Magic UI Lens effect on product card images
                // Uses IntersectionObserver for lazy loading
                if (pageType === 'default' || pageType === 'category' || pageType === 'brand' || pageType === 'search') {
                    // Delay initialization slightly to ensure DOM is ready
                    setTimeout(() => {
                        initializeLensImagesLazy();
                    }, 100);
                }
                
                // Initialize LightRays background effect on sections with data-light-rays attribute
                if (pageType === 'default') {
                    setTimeout(() => {
                        initializeLightRaysLazy();
                    }, 200);
                }

                const importPromises = [];

                // Find the appropriate page loader based on pageType
                const pageClassImporter = pageClasses[pageType];
                if (typeof pageClassImporter === 'function') {
                    importPromises.push(pageClassImporter());
                }

                // See if there is a page class default for a custom template
                const customTemplateImporter = customClasses[context.template];
                if (typeof customTemplateImporter === 'function') {
                    importPromises.push(customTemplateImporter());
                }

                // Wait for imports to resolve, then call load() on them
                Promise.all(importPromises).then(imports => {
                    imports.forEach(imported => {
                        imported.default.load(context);
                    });
                });
            });
        },
    };
};
