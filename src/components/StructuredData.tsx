import { Helmet } from 'react-helmet-async';

interface Props {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export default function StructuredData({ data }: Props) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}

// ── Pre-built schemas ─────────────────────────────────────────────────────────

export const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['TouristAttraction', 'LocalBusiness'],
  name: 'Modern Explorer',
  description: 'Immersive small-group guided tours in Crestone, Colorado exploring UFO hotspots, Spanish treasure legends, paranormal history, and the mysteries of the San Luis Valley and Sangre de Cristo mountains.',
  url: 'https://modernexplorer.me',
  telephone: '(719) 331-4200',
  email: 'admin@modernexplorer.me',
  image: 'https://modernexplorer.me/assets/images/content/Logo/ME Logo Draft 5.png',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Crestone',
    addressRegion: 'CO',
    postalCode: '81131',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 37.9947,
    longitude: -105.5183,
  },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    opens: '08:00',
    closes: '20:00',
  }],
  sameAs: [
    'https://instagram.com/modern._explorer',
    'https://www.youtube.com/@ModernExplorer',
    'https://x.com/ModernExplorer5',
  ],
  hasMap: 'https://modernexplorer.me/field-reports',
  knowsAbout: ['UFO sightings','paranormal research','San Luis Valley','Crestone Colorado','Spanish treasure','cryptozoology','Sasquatch'],
};

export const TOURIST_TRIP_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'TouristTrip',
  name: 'The Crestone Walking Tour',
  description: 'Immersive 45–60 minute small-group walking tour covering Crestone\'s spiritual history, mining past, paranormal activity, documented UAP phenomena, and the mysteries of the San Luis Valley.',
  url: 'https://modernexplorer.me/upcoming',
  touristType: ['History enthusiast','Paranormal researcher','Nature lover','Adventure traveler','UFO enthusiast'],
  duration: 'PT1H',
  maximumAttendeeCapacity: 12,
  minimumAttendeeCapacity: 2,
  provider: { '@type': 'LocalBusiness', name: 'Modern Explorer', url: 'https://modernexplorer.me' },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://fareharbor.com/embeds/book/modernexplorer/?full-items=yes',
  },
  itinerary: {
    '@type': 'ItemList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Town History & Indigenous Roots' },
      { '@type': 'ListItem', position: 2, name: 'Mining History & Silver Rush Sites' },
      { '@type': 'ListItem', position: 3, name: 'Spiritual Centers & Sanctuary Communities' },
      { '@type': 'ListItem', position: 4, name: 'Documented UFO/UAP Activity' },
      { '@type': 'ListItem', position: 5, name: 'Paranormal Hotspots & Local Accounts' },
    ],
  },
};

export const ENERGY_FAIR_EVENT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Crestone Energy Fair 2026',
  startDate: '2026-09-11',
  endDate: '2026-09-13',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  isAccessibleForFree: true,
  description: 'Annual free sustainability event in Crestone, Colorado — now in its nearly fourth decade. Features home tours, workshops on sustainable building, renewable energy, water systems, and food sovereignty.',
  url: 'https://crestoneenergyfair.org',
  location: {
    '@type': 'Place',
    name: 'Crestone, Colorado',
    address: { '@type': 'PostalAddress', addressLocality: 'Crestone', addressRegion: 'CO', postalCode: '81131', addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: 37.9947, longitude: -105.5183 },
  },
  organizer: { '@type': 'Organization', name: 'Crestone Energy Fair', url: 'https://crestoneenergyfair.org' },
};

export const VORTEX_FESTIVAL_EVENT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Crestone Vortex Festival 2026',
  startDate: '2026-08-08',
  endDate: '2026-08-09',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  description: 'First annual Crestone Vortex Festival presented by Dark Sky Astrology. Vendors, main stage speakers, community yoga, food trucks, Kid\'s Zone, and the first annual Dark Sky Astrology Retreat.',
  url: 'https://darkskyvortex.com',
  location: {
    '@type': 'Place',
    name: '187 W Silver Ave, Crestone, CO 81131',
    address: { '@type': 'PostalAddress', streetAddress: '187 W Silver Ave', addressLocality: 'Crestone', addressRegion: 'CO', postalCode: '81131', addressCountry: 'US' },
  },
  organizer: { '@type': 'Organization', name: 'Dark Sky Astrology', url: 'https://darkskyvortex.com' },
};

export function articleSchema(title: string, description: string, datePublished: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished,
    author: { '@type': 'Organization', name: 'Modern Explorer', url: 'https://modernexplorer.me' },
    publisher: { '@type': 'Organization', name: 'Modern Explorer', logo: { '@type': 'ImageObject', url: 'https://modernexplorer.me/assets/images/content/Logo/ME Logo Draft 5.png' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}
