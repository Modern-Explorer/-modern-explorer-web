import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SITE_NAME  = 'Modern Explorer';
const GSC_ID     = import.meta.env.VITE_GSC_VERIFICATION as string | undefined;
const DEFAULT_IMG = '/assets/images/content/Logo/ME Logo Draft 5.png';
const BASE_URL   = 'https://modernexplorer.me';
const DEFAULT_KW = 'Crestone Colorado tours, San Luis Valley, Great Sand Dunes, Sangre de Cristo mountains, UFO tours Colorado, paranormal tours, cryptozoology, Spanish treasure, Sasquatch expedition, guided tours Colorado, supernatural Colorado';

export default function SEO({ title, description, keywords, image, url }: SEOProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const img = image || DEFAULT_IMG;
  const kw  = keywords || DEFAULT_KW;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords"    content={kw} />

      {/* Open Graph */}
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={`${BASE_URL}${img}`} />
      {url && <meta property="og:url" content={`${BASE_URL}${url}`} />}
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={`${BASE_URL}${img}`} />

      {/* Google Search Console verification */}
      {GSC_ID && <meta name="google-site-verification" content={GSC_ID} />}

      {/* Geo */}
      <meta name="geo.region"      content="US-CO" />
      <meta name="geo.placename"   content="Crestone, Colorado" />
      <meta name="geo.position"    content="37.9947;-105.5183" />
      <meta name="ICBM"            content="37.9947, -105.5183" />
    </Helmet>
  );
}
