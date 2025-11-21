import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Menu',
      href: getPermalink('/menu'),
    },
    {
      text: 'Catering',
      href: getPermalink('/catering'),
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Reviews',
      href: getPermalink('/reviews'),
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],
  actions: [
    {
      text: 'Call (779) 702-9004',
      href: 'tel:7797029004',
      variant: 'primary',
    }
  ],
};

export const footerData = {
  links: [
    {
      title: 'Quick Links',
      links: [
        { text: 'About West 52 BBQ', href: getPermalink('/about') },
        { text: 'Menu', href: getPermalink('/menu') },
        { text: 'Catering Services', href: getPermalink('/catering') },
        { text: 'Reviews', href: getPermalink('/reviews') },
        { text: 'Contact Us', href: getPermalink('/contact') },
        { text: 'BBQ Blog', href: getBlogPermalink() },
      ],
    },
    {
      title: 'Our BBQ',
      links: [
        { text: 'Smoked Brisket', href: getPermalink('/menu#smoked-meats') },
        { text: 'Baby Back Ribs', href: getPermalink('/menu#smoked-meats') },
        { text: 'Pulled Pork', href: getPermalink('/menu#smoked-meats') },
        { text: 'Combo Platters', href: getPermalink('/menu#combo-platters') },
        { text: 'Sides & More', href: getPermalink('/menu#sides') },
      ],
    },
    {
      title: 'Services',
      links: [
        { text: 'Dine-In', href: getPermalink('/#') },
        { text: 'Takeout Orders', href: 'tel:7797029004' },
        { text: 'Catering', href: getPermalink('/catering') },
        { text: 'Request Quote', href: getPermalink('/catering#catering-form') },
        { text: 'Call Ahead: (779) 702-9004', href: 'tel:7797029004' },
      ],
    },
    {
      title: 'Location & Hours',
      links: [
        { text: 'Shorewood, IL 60404', href: getPermalink('/contact') },
        { text: 'Wed-Sat: 11AM-8PM', href: getPermalink('/contact') },
        { text: 'Sun: 12PM-5PM', href: getPermalink('/contact') },
        { text: 'Closed Mon-Tue', href: getPermalink('/contact') },
        { text: 'Get Directions', href: 'https://www.google.com/maps/dir//Shorewood,+IL+60404' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms & Conditions', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'X (Twitter)', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'RSS Feed', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    <div class="text-sm">
      <p class="mb-1"><strong>West 52 BBQ</strong> | Authentic Slow-Smoked BBQ in Shorewood, IL</p>
      <p class="mb-1">Veteran-Owned | 50+ Years Experience | Serving Will County</p>
      <p class="text-xs">© ${new Date().getFullYear()} West 52 BBQ. All rights reserved. <span class="italic">"You Don't Have To Fight It To Bite It!"</span></p>
    </div>
  `,
};
