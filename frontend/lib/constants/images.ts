/**
 * Centralized Static & Dynamic Image Registry
 * TV Repair CRM & Website
 */

export const APP_IMAGES = {
  brand: {
    logo: '/logo.png',
    logoDark: '/logo.png',
    authBg: '/images/auth-bg.png',
  },
  
  heroSlides: [
    {
      src: '/realimages/BONDING/DSC05309.webp',
      alt: 'Laser COF Panel Bonding Machine',
      title: 'Advanced Laser Bonding',
      category: 'BONDING',
    },
    {
      src: '/realimages/ASSEMBLY/DSC05238.webp',
      alt: 'Class 100K Clean Room Panel Assembly',
      title: 'Cleanroom Panel Assembly',
      category: 'ASSEMBLY',
    },
    {
      src: '/realimages/QC/DSC05425.webp',
      alt: 'Precision LED TV Screen Testing & QC',
      title: '100% Quality Check',
      category: 'QC',
    },
    {
      src: '/realimages/BONDING/DSC05374.webp',
      alt: 'Automated Tab Bonding Machine',
      title: 'Automated Tab Bonding',
      category: 'BONDING',
    },
    {
      src: '/realimages/SPEAKER/DSC07635.webp',
      alt: 'In-House Speaker Manufacturing',
      title: 'Speaker Manufacturing',
      category: 'SPEAKER',
    },
  ],

  services: {
    bonding: '/realimages/BONDING/DSC05309.webp',
    assembly: '/realimages/ASSEMBLY/DSC05238.webp',
    qc: '/realimages/QC/DSC05425.webp',
    building: '/realimages/BUILDING/DSC05217.webp',
    speaker: '/realimages/SPEAKER/DSC07635.webp',
    pickDrop: '/realimages/BUILDING/DSC05225.webp',
  },

  about: {
    sahil: '/images/about/sahil.jpg',
    workshop1: '/realimages/BUILDING/DSC05217.webp',
    bondingLab: '/realimages/BONDING/DSC05374.webp',
    qcLab: '/realimages/QC/DSC05474.webp',
    assemblyRoom: '/realimages/ASSEMBLY/DSC05252.webp',
  },

  galleryCategories: {
    BONDING: [
      '/realimages/BONDING/DSC05309.webp',
      '/realimages/BONDING/DSC05312.webp',
      '/realimages/BONDING/DSC05320.webp',
      '/realimages/BONDING/DSC05327.webp',
      '/realimages/BONDING/DSC05335.webp',
      '/realimages/BONDING/DSC05374.webp',
    ],
    ASSEMBLY: [
      '/realimages/ASSEMBLY/DSC05238.webp',
      '/realimages/ASSEMBLY/DSC05241.webp',
      '/realimages/ASSEMBLY/DSC05247.webp',
      '/realimages/ASSEMBLY/DSC05250.webp',
      '/realimages/ASSEMBLY/DSC05252.webp',
    ],
    QC: [
      '/realimages/QC/DSC05425.webp',
      '/realimages/QC/DSC05429.webp',
      '/realimages/QC/DSC05431.webp',
      '/realimages/QC/DSC05474.webp',
      '/realimages/QC/DSC05495.webp',
    ],
    SPEAKER: [
      '/realimages/SPEAKER/DSC07635.webp',
      '/realimages/SPEAKER/DSC07627.webp',
      '/realimages/SPEAKER/DSC07633.webp',
      '/realimages/SPEAKER/DSC07640.webp',
    ],
    BUILDING: [
      '/realimages/BUILDING/DSC05217.webp',
      '/realimages/BUILDING/DSC05218.webp',
      '/realimages/BUILDING/DSC05225.webp',
    ],
  },

  placeholders: {
    service: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
    blog: 'https://images.unsplash.com/photo-1514489383739-55b8e387a112?w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
    ticket: 'https://images.unsplash.com/photo-1597849114675-9c869fb7a710?w=800&q=80',
  },
};

export function getValidImageUrl(url?: string | null, fallbackCategory: keyof typeof APP_IMAGES.placeholders = 'service'): string {
  if (!url || url.trim() === '') {
    return APP_IMAGES.placeholders[fallbackCategory];
  }
  return url;
}
