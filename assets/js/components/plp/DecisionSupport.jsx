import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { BlurFade } from '../BlurFade';

/**
 * FAQ data for axle kits
 */
const FAQ_ITEMS = [
  {
    id: 'capacity',
    question: 'How do I determine what capacity I need?',
    answer: 'Your trailer\'s GVWR (Gross Vehicle Weight Rating) should match or exceed your total load weight. For example, if hauling a 5,000 lb boat plus 1,000 lb gear, you\'d need at least a 6K capacity axle. Always round up for safety margin.',
  },
  {
    id: 'bolt-pattern',
    question: 'How do I measure my bolt pattern?',
    answer: 'Count the bolt holes on your hub (4, 5, 6, or 8). Then measure the diameter of the bolt circle. For 5-lug patterns, measure from the center of one bolt hole to the outer edge of the hole directly across. Common patterns: 5 on 4.5" (light duty), 6 on 5.5" (medium), 8 on 6.5" (heavy duty).',
  },
  {
    id: 'brake-type',
    question: 'Electric vs hydraulic brakes - which do I need?',
    answer: 'Electric brakes are most common and require a brake controller in your tow vehicle. Hydraulic brakes are self-actuating (surge brakes) and common on boat trailers. Idler axles have no brakes and are typically used on lighter trailers under 3,000 lbs.',
  },
  {
    id: 'single-tandem',
    question: 'Single vs tandem axle - what\'s the difference?',
    answer: 'Single axle trailers are lighter and more maneuverable, ideal for loads under 5,000 lbs. Tandem (dual) axles provide better stability, weight distribution, and braking power for heavier loads. Triple axles are for heavy commercial applications.',
  },
  {
    id: 'what-included',
    question: 'What\'s included in an axle kit?',
    answer: 'Our complete kits include: hub/drum assemblies, inner and outer bearings, grease seals, dust caps, lug nuts, and mounting hardware. Electric brake kits also include brake assemblies. Just add the axle beam (sold separately or bundled).',
  },
];

/**
 * Resource links
 */
const RESOURCES = [
  {
    id: 'install-guide',
    title: 'Installation Guide',
    description: 'Step-by-step PDF',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    href: '/content/installation-guide.pdf',
  },
  {
    id: 'video-tutorial',
    title: 'Video Tutorial',
    description: 'Watch how to install',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    href: '/pages/helpful-information.html/',
  },
  {
    id: 'bearing-lookup',
    title: 'Bearing Number Lookup',
    description: 'Find by bearing code',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    href: '/pages/helpful-information.html/',
  },
  {
    id: 'contact',
    title: 'Talk to an Expert',
    description: 'Get personalized help',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    href: '/contact-us/',
  },
];

/**
 * DecisionSupport - FAQ accordion and resource links below product grid
 */
export function DecisionSupport() {
  return (
    <div className="tpu-decision-support">
      <BlurFade delay={0.1} direction="up" offset={15}>
        <header className="tpu-decision-support__header">
          <h2 className="tpu-decision-support__title">How to Choose the Right Kit</h2>
          <p className="tpu-decision-support__subtitle">
            Quick answers to common fitment questions
          </p>
        </header>
      </BlurFade>

      <div className="tpu-decision-support__content">
        {/* FAQ Accordion */}
        <BlurFade delay={0.2} direction="up" offset={10}>
          <div className="tpu-decision-support__faq">
            <Accordion type="single" collapsible className="tpu-decision-support__accordion">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </BlurFade>

        {/* Resource Links */}
        <BlurFade delay={0.3} direction="up" offset={10}>
          <div className="tpu-decision-support__resources">
            <h3 className="tpu-decision-support__resources-title">Resources</h3>
            <div className="tpu-decision-support__resources-grid">
              {RESOURCES.map(resource => (
                <a
                  key={resource.id}
                  href={resource.href}
                  className="tpu-decision-support__resource"
                >
                  <span className="tpu-decision-support__resource-icon">
                    {resource.icon}
                  </span>
                  <span className="tpu-decision-support__resource-content">
                    <span className="tpu-decision-support__resource-title">
                      {resource.title}
                    </span>
                    <span className="tpu-decision-support__resource-desc">
                      {resource.description}
                    </span>
                  </span>
                  <svg 
                    className="tpu-decision-support__resource-arrow"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}

export default DecisionSupport;

