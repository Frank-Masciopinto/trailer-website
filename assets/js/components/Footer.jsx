import React, { useState, useCallback } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/Accordion';
import { Separator } from './ui/Separator';
import ShimmerButton from './ShimmerButton';

/**
 * Footer - Conversion-optimized footer with fitment help, 4-column links,
 * newsletter capture, and category-aware compliance microcopy
 */

// Analytics tracking helper
const trackEvent = (eventName, data = {}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...data,
    });
  }
};

// Fitment Help Band Component
function FitmentHelpBand({ phoneNumber, whatsappNumber }) {
  const handleCtaClick = (buttonType) => {
    trackEvent('footer_fitment_cta_click', { button: buttonType });
  };

  return (
    <section className="tpu-footer-fitment" aria-labelledby="fitment-help-heading">
      <div className="container">
        <div className="tpu-footer-fitment__inner">
          <h2 id="fitment-help-heading" className="tpu-footer-fitment__heading">
            Not 100% sure it fits?
          </h2>
          <p className="tpu-footer-fitment__subtext">
            Our experts help thousands of customers find the right kit every week.
          </p>
          <div className="tpu-footer-fitment__ctas">
            <ShimmerButton
              href="/pages/helpful-information.html/"
              onClick={() => handleCtaClick('wizard')}
              className="tpu-footer-fitment__btn"
              shimmerColor="#ffffff"
              background="rgba(255, 107, 53, 1)"
            >
              <svg className="tpu-footer-fitment__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              Use Fitment Wizard
            </ShimmerButton>
            
            <a
              href={`https://wa.me/${whatsappNumber || '15551234567'}?text=Hi, I need help finding the right trailer parts`}
              target="_blank"
              rel="noopener noreferrer"
              className="tpu-footer-fitment__link"
              onClick={() => handleCtaClick('text')}
            >
              <svg className="tpu-footer-fitment__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              Text a Photo
            </a>
            
            {phoneNumber && (
              <a
                href={`tel:${phoneNumber.replace(/\D/g, '')}`}
                className="tpu-footer-fitment__link"
                onClick={() => handleCtaClick('call')}
              >
                <svg className="tpu-footer-fitment__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Talk to an Expert
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer Column Links Data
const footerColumns = [
  {
    id: 'shop-kits',
    title: 'Shop Kits',
    links: [
      { label: 'Trailer Axle Kits', href: '/trailer-axle-kits-1/' },
      { label: 'Suspension Kits', href: '/categories/trailer-suspension.html' },
      { label: 'Brake Kits', href: '/categories/trailer-axle-parts/trailer-brakes.html' },
      { label: 'Trailer Lights', href: '/categories/trailer-lights.html' },
      { label: 'Tires & Wheels', href: '/categories/tires-wheels.html' },
    ],
  },
  {
    id: 'categories',
    title: 'Categories',
    links: [
      { label: 'Axles', href: '/categories/all-products/axles.html' },
      { label: 'Trailer Axle Parts', href: '/categories/trailer-axle-parts.html' },
      { label: 'Fenders', href: '/categories/fenders.html' },
      { label: 'Cargo Control', href: '/categories/all-products/cargo-control.html' },
      { label: 'Towing Accessories', href: '/categories/towing-accessories.html' },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    links: [
      { label: 'About Us', href: '/about-us-trailer-parts-unlimited/' },
      { label: 'Contact Us', href: '/contact-us/' },
      { label: 'Helpful Information', href: '/pages/helpful-information.html/' },
      { label: 'Shipping & Returns', href: '/shipping-returns/' },
      { label: 'Track Your Order', href: '/account.php?action=order_status' },
    ],
  },
  {
    id: 'account',
    title: 'Account',
    links: [
      { label: 'Login', href: '/login.php' },
      { label: 'Sign Up', href: '/login.php?action=create_account' },
      { label: 'Wishlist', href: '/wishlist.php' },
      { label: 'Gift Certificates', href: '/giftcertificates.php' },
      { label: 'View Cart', href: '/cart.php' },
    ],
  },
];

// Footer Columns Component (Desktop: grid, Mobile: accordion)
function FooterColumns() {
  return (
    <section className="tpu-footer-columns" aria-label="Footer navigation">
      {/* Desktop View - Grid */}
      <div className="tpu-footer-columns__desktop">
        {footerColumns.map((column) => (
          <div key={column.id} className="tpu-footer-columns__col">
            <h3 className="tpu-footer-columns__title">{column.title}</h3>
            <ul className="tpu-footer-columns__list">
              {column.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="tpu-footer-columns__link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mobile View - Accordion */}
      <div className="tpu-footer-columns__mobile">
        <Accordion type="multiple" className="tpu-footer-accordion">
          {footerColumns.map((column) => (
            <AccordionItem key={column.id} value={column.id}>
              <AccordionTrigger>{column.title}</AccordionTrigger>
              <AccordionContent>
                <ul className="tpu-footer-columns__list">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="tpu-footer-columns__link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// Newsletter Capture Component
function NewsletterCapture({ subscribeUrl, customerEmail }) {
  const [email, setEmail] = useState(customerEmail || '');
  const [segment, setSegment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!email || !segment) {
      setMessage({ type: 'error', text: 'Please enter your email and select a trailer type.' });
      return;
    }

    setIsSubmitting(true);
    trackEvent('footer_newsletter_submit', { segment });

    try {
      const formData = new FormData();
      formData.append('action', 'subscribe');
      formData.append('nl_email', email);
      formData.append('nl_first_name', 'bc');
      formData.append('check', '1');
      formData.append('nl_segment', segment);

      const response = await fetch(subscribeUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'You\'re subscribed! Check your inbox for fitment tips.' });
        setEmail('');
        setSegment('');
      } else {
        setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [email, segment, subscribeUrl]);

  return (
    <section className="tpu-footer-newsletter" aria-labelledby="newsletter-heading">
      <div className="tpu-footer-newsletter__inner">
        <h3 id="newsletter-heading" className="tpu-footer-newsletter__title">
          Get the right kit the first time
        </h3>
        <p className="tpu-footer-newsletter__helper">
          Seasonal reminders + fitment tips. No spam.
        </p>
        
        <form className="tpu-footer-newsletter__form" onSubmit={handleSubmit}>
          <div className="tpu-footer-newsletter__fields">
            <div className="tpu-footer-newsletter__field">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                type="email"
                id="footer-email"
                name="nl_email"
                className="tpu-footer-newsletter__input"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            
            <div className="tpu-footer-newsletter__field">
              <label htmlFor="footer-segment" className="sr-only">Trailer type</label>
              <select
                id="footer-segment"
                name="nl_segment"
                className="tpu-footer-newsletter__select"
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                required
              >
                <option value="" disabled>Select trailer type</option>
                <option value="boat">Boat Trailer</option>
                <option value="rv">RV / Camper</option>
                <option value="utility">Utility / Cargo</option>
                <option value="fleet">Fleet / Commercial</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="tpu-footer-newsletter__btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send me checklists'}
            </button>
          </div>
          
          {message && (
            <p className={`tpu-footer-newsletter__message tpu-footer-newsletter__message--${message.type}`}>
              {message.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

// Bottom Bar Component
function FooterBottomBar({ 
  storeName, 
  showCompliance, 
  socialMediaHtml, 
  paymentIconsHtml 
}) {
  const currentYear = new Date().getFullYear();

  return (
    <section className="tpu-footer-bottom">
      <Separator className="tpu-footer-bottom__separator" />
      
      <div className="tpu-footer-bottom__inner">
        {/* Left: Payment & Shipping */}
        <div className="tpu-footer-bottom__payments">
          {paymentIconsHtml && (
            <div 
              className="tpu-footer-bottom__payment-icons"
              dangerouslySetInnerHTML={{ __html: paymentIconsHtml }}
            />
          )}
          <span className="tpu-footer-bottom__shipping-badge">
            <svg className="tpu-footer-bottom__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            Ships to US &amp; Canada
          </span>
        </div>

        {/* Center: Social Icons */}
        <div className="tpu-footer-bottom__social">
          {socialMediaHtml && (
            <div dangerouslySetInnerHTML={{ __html: socialMediaHtml }} />
          )}
        </div>

        {/* Right: Legal Links */}
        <div className="tpu-footer-bottom__legal">
          <nav aria-label="Legal links">
            <ul className="tpu-footer-bottom__legal-list">
              <li><a href="/pages/privacy-policy.html">Privacy Policy</a></li>
              <li><a href="/pages/terms-and-conditions.html">Terms & Conditions</a></li>
              <li><a href="/contact-us/">Contact Us</a></li>
            </ul>
          </nav>
          <p className="tpu-footer-bottom__copyright">
            © {currentYear} {storeName}. All rights reserved.
          </p>
        </div>
      </div>

      {/* Compliance Microcopy for Lighting Categories */}
      {showCompliance && (
        <div className="tpu-footer-bottom__compliance">
          <p>
            <svg className="tpu-footer-bottom__compliance-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            Meets FMVSS/CMVSS 108 when installed per diagram.
          </p>
        </div>
      )}
    </section>
  );
}

// Main Footer Component
export function Footer({
  phoneNumber,
  whatsappNumber,
  subscribeUrl,
  customerEmail,
  storeName,
  showCompliance,
  socialMediaHtml,
  paymentIconsHtml,
}) {
  return (
    <div className="tpu-footer-react">
      <FitmentHelpBand 
        phoneNumber={phoneNumber} 
        whatsappNumber={whatsappNumber} 
      />
      
      <div className="container">
        <div className="tpu-footer-main">
          <FooterColumns />
          <NewsletterCapture 
            subscribeUrl={subscribeUrl} 
            customerEmail={customerEmail} 
          />
        </div>
      </div>
      
      <FooterBottomBar
        storeName={storeName}
        showCompliance={showCompliance}
        socialMediaHtml={socialMediaHtml}
        paymentIconsHtml={paymentIconsHtml}
      />
    </div>
  );
}

export default Footer;

