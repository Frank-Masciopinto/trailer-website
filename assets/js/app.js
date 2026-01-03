__webpack_public_path__ = window.__webpack_public_path__; // eslint-disable-line

import Global from './theme/global';

// React imports for Magic UI components
import React from 'react';
import { createRoot } from 'react-dom/client';
import MagicHeader from './components/MagicHeader';
// import LaserFlow from './components/LaserFlow'; // Replaced with static image background
import AnimatedBentoGrid from './components/AnimatedBentoGrid';
// import HeroStats from './components/HeroStats'; // Removed from hero
import GoogleReviews from './components/GoogleReviews';
import WhyKitsBeatParts from './components/WhyKitsBeatParts';
import CapacityGrid from './components/CapacityGrid';
import Footer from './components/Footer';
import { initializeLensImagesLazy } from './components/LensInitializer';
import { initializeLightRaysLazy } from './components/LightRaysInitializer';

// PLP (Category page) components
import { FitmentFinder } from './components/plp/FitmentFinder';
import { QuickPathChips } from './components/plp/QuickPathChips';
import { DecisionSupport } from './components/plp/DecisionSupport';
import { initializeProductCardBadges, injectHelpCards } from './components/plp';

// PDP (Product page) components
import { PDPApp } from './components/pdp';

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
                
                // Render Magic UI React header on ALL pages
                const magicHeaderContainer = document.getElementById('magic-header-root');
                if (magicHeaderContainer) {
                    const root = createRoot(magicHeaderContainer);
                    root.render(React.createElement(MagicHeader, {
                        initialCartQuantity: context.cartQuantity || 0
                    }));
                    
                    // Hide the old header when Magic Header is active
                    const oldHeader = document.querySelector('header.header.tpu-header');
                    if (oldHeader) {
                        oldHeader.style.display = 'none';
                    }
                    // Also hide any duplicate scroll progress bars
                    const oldScrollProgress = document.querySelector('.tpu-scroll-progress');
                    if (oldScrollProgress) {
                        oldScrollProgress.style.display = 'none';
                    }
                    // Hide the old skip link since Magic Header doesn't have one yet
                    const oldSkipLink = document.querySelector('.skip-to-main-link');
                    if (oldSkipLink) {
                        oldSkipLink.style.display = 'none';
                    }
                }
                
                // LaserFlow background replaced with static image (trailer-horizontal.webp)
                // See templates/components/tpu/hero.html for image background implementation
                
                // Render animated Bento Grid with scroll animations on homepage
                const bentoContainer = document.getElementById('animated-bento-root');
                if (bentoContainer && pageType === 'default') {
                    const bentoRoot = createRoot(bentoContainer);
                    bentoRoot.render(React.createElement(AnimatedBentoGrid));
                }
                
                // Render Google Reviews section with MagicUI components
                const googleReviewsContainer = document.getElementById('google-reviews-root');
                if (googleReviewsContainer && pageType === 'default') {
                    const reviewsRoot = createRoot(googleReviewsContainer);
                    reviewsRoot.render(React.createElement(GoogleReviews));
                }
                
                // Render Why Kits Beat Parts section with MagicUI components
                const whyKitsContainer = document.getElementById('why-kits-root');
                if (whyKitsContainer && pageType === 'default') {
                    const kitsRoot = createRoot(whyKitsContainer);
                    kitsRoot.render(React.createElement(WhyKitsBeatParts));
                }
                
                // Render Capacity Grid section with MagicUI components
                const capacityGridContainer = document.getElementById('capacity-grid-root');
                if (capacityGridContainer && pageType === 'default') {
                    const capacityRoot = createRoot(capacityGridContainer);
                    capacityRoot.render(React.createElement(CapacityGrid));
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

                // =============================================================
                // CATEGORY PAGE (PLP) - Enhanced Fitment-First Components
                // =============================================================
                if (pageType === 'category' || pageType === 'brand' || pageType === 'search') {
                    // Set category name on window for components to access
                    if (context.categoryName) {
                        window.categoryName = context.categoryName;
                    }

                    // Fitment Finder - Hero section
                    const fitmentFinderContainer = document.getElementById('fitment-finder-root');
                    if (fitmentFinderContainer) {
                        const categoryName = fitmentFinderContainer.dataset.categoryName || '';
                        const fitmentRoot = createRoot(fitmentFinderContainer);
                        fitmentRoot.render(React.createElement(FitmentFinder, {
                            categoryName: categoryName
                        }));
                    }

                    // Quick Path Chips - Intent-based shortcuts
                    const quickChipsContainer = document.getElementById('quick-path-chips-root');
                    if (quickChipsContainer) {
                        const categoryName = quickChipsContainer.dataset.categoryName || '';
                        const chipsRoot = createRoot(quickChipsContainer);
                        chipsRoot.render(React.createElement(QuickPathChips, {
                            categoryName: categoryName
                        }));
                    }

                    // Decision Support - FAQ accordion below grid
                    const decisionSupportContainer = document.getElementById('decision-support-root');
                    if (decisionSupportContainer) {
                        const supportRoot = createRoot(decisionSupportContainer);
                        supportRoot.render(React.createElement(DecisionSupport));
                    }

                    // Initialize Product Card Badges (Fits/Includes/Ships)
                    // Delay to ensure product cards are rendered
                    setTimeout(() => {
                        initializeProductCardBadges();
                    }, 150);

                    // Inject Help Cards into product grid
                    // After 8th product, then every 24 products
                    setTimeout(() => {
                        injectHelpCards('#product-listing-container');
                    }, 200);

                    // Re-initialize badges and help cards after AJAX filter/pagination
                    $(document).on('statechange', () => {
                        setTimeout(() => {
                            initializeProductCardBadges();
                            injectHelpCards('#product-listing-container');
                        }, 300);
                    });

                    // Scroll to grid if coming from quick path chip
                    if (sessionStorage.getItem('tpuScrollToGrid') === 'true') {
                        sessionStorage.removeItem('tpuScrollToGrid');
                        const productListing = document.getElementById('product-listing-container');
                        if (productListing) {
                            setTimeout(() => {
                                productListing.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                        }
                    }
                }

                // =============================================================
                // PRODUCT PAGE (PDP) - MCP-based React PDP
                // =============================================================
                if (pageType === 'product') {
                    const pdpContainer = document.getElementById('pdp-react-root');
                    if (pdpContainer) {
                        // Build product object from injected context data
                        const product = {
                            id: context.productId,
                            title: context.productTitle,
                            sku: context.productSku,
                            brand: context.productBrand,
                            price: context.productPrice,
                            images: context.productImages || [],
                            main_image: context.productMainImage,
                            options: context.productOptions || [],
                            custom_fields: context.productCustomFields || [],
                            category: context.productCategory || [],
                            rating: context.productRating,
                            num_reviews: context.productNumReviews || 0,
                            reviews: context.productReviews,
                            availability: context.productAvailability,
                            stock_level: context.productStockLevel,
                            out_of_stock: context.productOutOfStock,
                            shipping: context.productShipping,
                            cart_url: context.productCartUrl,
                            url: context.productUrl,
                            min_purchase_quantity: context.productMinPurchaseQuantity || 1,
                            max_purchase_quantity: context.productMaxPurchaseQuantity,
                            pre_order: context.productPreOrder,
                            related_products: context.productRelatedProducts,
                        };

                        // Remove skeleton/loading state
                        const skeleton = pdpContainer.querySelector('.tpu-pdp-skeleton');
                        if (skeleton) {
                            skeleton.remove();
                        }
                        pdpContainer.removeAttribute('aria-busy');
                        pdpContainer.removeAttribute('aria-label');

                        // Render PDP React app
                        const pdpRoot = createRoot(pdpContainer);
                        pdpRoot.render(React.createElement(PDPApp, {
                            product: product,
                            context: context,
                        }));
                    }
                }

                // Render Footer React component on all pages
                const footerContainer = document.getElementById('tpu-footer-root');
                if (footerContainer) {
                    // Get data attributes from the container
                    const phoneNumber = footerContainer.dataset.phoneNumber || '';
                    const whatsappNumber = footerContainer.dataset.whatsappNumber || '';
                    const subscribeUrl = footerContainer.dataset.subscribeUrl || '';
                    const customerEmail = footerContainer.dataset.customerEmail || '';
                    const storeName = footerContainer.dataset.storeName || '';
                    
                    // Determine if compliance message should show (lighting categories)
                    const currentUrl = window.location.pathname.toLowerCase();
                    const showCompliance = currentUrl.includes('light') || currentUrl.includes('lamp');
                    
                    // Also show compliance in fallback footer if applicable
                    const complianceEl = document.getElementById('tpu-footer-compliance');
                    if (complianceEl && showCompliance) {
                        complianceEl.style.display = 'block';
                    }

                    // Get social media and payment icons HTML from fallback elements
                    const socialEl = document.querySelector('.tpu-footer-bottom__social .socialLinks');
                    const socialMediaHtml = socialEl ? socialEl.outerHTML : '';
                    
                    const paymentEl = document.querySelector('.footer-payment-icons');
                    const paymentIconsHtml = paymentEl ? paymentEl.outerHTML : '';

                    // Show the JS-enabled footer and render React
                    const jsFooter = document.querySelector('.tpu-footer--js');
                    if (jsFooter) {
                        jsFooter.style.display = 'block';
                    }

                    // Remove aria-hidden and render
                    footerContainer.removeAttribute('aria-hidden');
                    
                    const footerRoot = createRoot(footerContainer);
                    footerRoot.render(React.createElement(Footer, {
                        phoneNumber,
                        whatsappNumber,
                        subscribeUrl,
                        customerEmail,
                        storeName,
                        showCompliance,
                        socialMediaHtml,
                        paymentIconsHtml,
                    }));

                    // Hide fallback content
                    const fallbacks = document.querySelectorAll('[id$="-fallback"]');
                    fallbacks.forEach(el => {
                        el.style.display = 'none';
                    });
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
